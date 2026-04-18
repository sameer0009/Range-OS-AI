from abc import ABC, abstractmethod
from typing import Dict, List, Optional
from pydantic import BaseModel

class NodeSpecs(BaseModel):
    id: str
    type: str # vm, container
    cpu: int
    memory_mb: int
    disk_gb: int
    image: str

class NetworkZone(BaseModel):
    id: str
    vlan: int
    subnet: str
    trust_level: str # red, blue, target, evidence

class HypervisorAdapter(ABC):
    @abstractmethod
    async def provision_node(self, specs: NodeSpecs) -> str:
        """Provision a new compute node and return its hardware ID."""
        pass

    @abstractmethod
    async def setup_network(self, zone: NetworkZone) -> str:
        """Setup virtual networking zone and return its hardware ID."""
        pass

    @abstractmethod
    async def destroy_resource(self, resource_id: str):
        """Teardown a previously provisioned hardware resource."""
        pass

    @abstractmethod
    async def create_snapshot(self, resource_id: str, label: str) -> str:
        """Create a point-in-time snapshot of the node."""
        pass
