from typing import Dict, List, Any
from ..models.models import PolicyRule

class TacticalRuleEngine:
    def __init__(self, rules: List[PolicyRule]):
        # Higher priority (lower number) evaluated first
        self.rules = sorted(rules, key=lambda r: r.priority)

    def evaluate(self, context: Dict[str, Any]) -> str:
        """
        Evaluates a set of rules against the provided context.
        Strategy: Deny-Override / Closed-World (Default Deny)
        """
        final_decision = "DENIED" # Default if no rules match

        for rule in self.rules:
            if self._matches_conditions(rule.condition_json, context):
                effect = rule.effect.upper()
                
                if effect == "DENY":
                    return "DENIED" # Instant Deny override
                
                if effect == "ALLOW":
                    final_decision = "ALLOWED"
                
                if effect == "APPROVAL_REQUIRED":
                    # Only upgrade to approval if not already allowed
                    if final_decision != "ALLOWED":
                        final_decision = "APPROVAL_REQUIRED"

        return final_decision

    def _matches_conditions(self, conditions: Dict[str, Any], context: Dict[str, Any]) -> bool:
        """
        Simple attribute matching. 
        Supports equality checks for all keys in condition_json.
        """
        for key, value in conditions.items():
            if key not in context or context[key] != value:
                return False
        return True
