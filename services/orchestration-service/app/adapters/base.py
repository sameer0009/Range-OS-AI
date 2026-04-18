from abc import ABC, abstractmethod
from typing import Dict, List, Optional
from pydantic import BaseModel

class NodeSpecs(BaseModel):
    id: str
    lab_id: str
    type: str # vm, container
    cpu: int
    memory_mb: int
    disk_gb: int
    image: str
    metadata: Dict[str, str] = {}

class NetworkZone(BaseModel):
    id: str
    lab_id: str
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

    @abstractmethod
    async def restore_snapshot(self, resource_id: str, snapshot_id: str):
        """Restore a node to a previous snapshot state."""
        pass

    @abstractmethod
    async def get_node_status(self, resource_id: str) -> str:
        """Query the real-time hardware status of the node."""
        pass

    @abstractmethod
    async def set_node_state(self, resource_id: str, state: str):
        """Set the execution state (start, stop, pause) of the node."""
        pass
