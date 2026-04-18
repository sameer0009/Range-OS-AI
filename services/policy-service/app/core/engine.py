from typing import Dict, List, Optional, Tuple
from app.models.models import PolicyRule

class PolicyEngine:
    @staticmethod
    def evaluate(rules: List[PolicyRule], context: Dict) -> Tuple[str, str, Optional[PolicyRule]]:
        """
        Deterministic Deny-Override evaluation.
        Returns: (Decision, Reason, Rule)
        """
        # 1. Deny check (Highest priority)
        for rule in rules:
            if rule.effect == "DENY" and PolicyEngine._matches(rule.condition_json, context):
                return "DENIED", f"Action restricted by policy rule: {rule.action_type}", rule
        
        # 2. Approval check
        for rule in rules:
            if rule.effect == "APPROVAL_REQUIRED" and PolicyEngine._matches(rule.condition_json, context):
                return "APPROVAL_REQUIRED", "Administrator approval required for this action", rule

        # 3. Allow check
        for rule in rules:
            if rule.effect == "ALLOW" and PolicyEngine._matches(rule.condition_json, context):
                return "ALLOWED", "Action permitted by policy", rule

        # 4. Default fallback
        return "DENIED", "No matching policy rule found (Secure by Default)", None

    @staticmethod
    def _matches(condition: Dict, context: Dict) -> bool:
        """
        Simple atomic condition matcher.
        Supports: lte, gte, eq, neq
        """
        if not condition:
            return True
        
        field = condition.get("field")
        operator = condition.get("operator")
        required_value = condition.get("value")
        
        # Basic context traversal (e.g. "resource.node_count")
        current_val = context
        try:
            for part in field.split('.'):
                current_val = current_val.get(part)
        except (AttributeError, TypeError):
            return False

        if operator == "lte": return current_val <= required_value
        if operator == "gte": return current_val >= required_value
        if operator == "eq": return current_val == required_value
        if operator == "neq": return current_val != required_value
        
        return False
