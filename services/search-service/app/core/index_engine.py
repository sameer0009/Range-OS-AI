import sqlite3
import uuid
import structlog
from typing import List, Dict, Optional

logger = structlog.get_logger()

class SearchEngine:
    def __init__(self, db_path: str = "search_index.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            # Create FTS5 virtual table for high-speed searching
            conn.execute("""
                CREATE VIRTUAL TABLE IF NOT EXISTS global_search USING fts5(
                    id UNINDEXED, 
                    type, 
                    title, 
                    content, 
                    mission_id UNINDEXED,
                    route UNINDEXED,
                    tokenize='porter unicode61'
                )
            """)
            conn.commit()

    async def index_document(self, doc_id: str, doc_type: str, title: str, content: str, mission_id: Optional[str] = None, route: str = ""):
        with sqlite3.connect(self.db_path) as conn:
            # Delete old version if exists
            conn.execute("DELETE FROM global_search WHERE id = ?", (doc_id,))
            
            # Insert new record
            conn.execute("""
                INSERT INTO global_search (id, type, title, content, mission_id, route)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (doc_id, doc_type, title, content, mission_id, route))
            conn.commit()
            await logger.info("document_indexed", id=doc_id, type=doc_type)

    async def search(self, query: str, mission_id: Optional[str] = None) -> List[Dict]:
        results = []
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            
            # Weighted search across title and content
            # Filters by mission_id context (GLOBAL if mission_id is null)
            sql = """
                SELECT id, type, title, route, snippet(global_search, 3, '<b>', '</b>', '...', 10) as snippet
                FROM global_search 
                WHERE (global_search MATCH ?) 
                AND (mission_id IS NULL OR mission_id = ?)
                ORDER BY rank
                LIMIT 12
            """
            
            cursor = conn.execute(sql, (query, mission_id))
            for row in cursor.fetchall():
                results.append(dict(row))
                
        return results
