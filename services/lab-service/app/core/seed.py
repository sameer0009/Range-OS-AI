import uuid
from sqlmodel import Session, select
from ..models.models import LabTemplate
from .db import engine

WEB_PENTEST_TOPOLOGY = {
    "nodes": [
        {
            "id": "kali-red",
            "name": "Kali_Attacker_v1",
            "type": "RED",
            "image": "kali-noble-tactical",
            "cpu": 2,
            "ram": 4096
        },
        {
            "id": "web-target",
            "name": "Ubuntu_Juice_Shop",
            "type": "TARGET",
            "image": "ubuntu-juice-shop",
            "cpu": 1,
            "ram": 2048
        },
        {
            "id": "db-node",
            "name": "Postgres_Backend",
            "type": "TARGET",
            "image": "rangeos-base-pg",
            "cpu": 1,
            "ram": 1024
        }
    ],
    "networks": [
        {
            "id": "mission-isolated",
            "type": "ISOLATED",
            "subnet": "10.0.10.0/24",
            "dhcp": True
        }
    ],
    "tasks": [
        {"id": "t1", "title": "Identify Target IP", "description": "Scan the 10.0.10.0/24 subnet to find the web server."},
        {"id": "t2", "title": "Exploit OWASP Vulnerabilities", "description": "Compromise the Juice Shop application."}
    ]
}

def seed_missions():
    with Session(engine) as session:
        # Check if already exists
        existing = session.exec(select(LabTemplate).where(LabTemplate.name == "Beginner Web Pentest Lab")).first()
        if existing:
            print("[*] Template already exists. Skipping seed.")
            return

        template = LabTemplate(
            id=uuid.uuid4(),
            name="Beginner Web Pentest Lab",
            description="A realistic 3-tier offensive training environment featuring Kali Linux and OWASP Juice Shop.",
            complexity="Beginner",
            topology_spec=WEB_PENTEST_TOPOLOGY,
            is_public=True
        )
        
        session.add(template)
        session.commit()
        print("[+] Beginner Web Pentest Lab seeded successfully.")

if __name__ == "__main__":
    seed_missions()
