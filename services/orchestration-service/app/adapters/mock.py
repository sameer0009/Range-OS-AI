from .base import HypervisorAdapter, NodeSpecs, NetworkZone
import structlog
import asyncio
import uuid

logger = structlog.get_logger()

class MockAdapter(HypervisorAdapter):
    def __init__(self):
        self.resources = {}

    async def provision_node(self, specs: NodeSpecs) -> str:
        hardware_id = f"mock-vm-{uuid.uuid4().hex[:8]}"
        await logger.info("mock_provision_started", node_id=specs.id, hw_id=hardware_id)
        # Simulate hardware latency
        await asyncio.sleep(0.5)
        self.resources[hardware_id] = specs
        return hardware_id

    async def setup_network(self, zone: NetworkZone) -> str:
        vnet_id = f"mock-vnet-{zone.vlan}"
        await logger.info("mock_network_init", zone_id=zone.id, vnet_id=vnet_id)
        await asyncio.sleep(0.3)
        return vnet_id

    async def destroy_resource(self, resource_id: str):
        await logger.info("mock_teardown", hw_id=resource_id)
        await asyncio.sleep(0.1)
        if resource_id in self.resources:
            del self.resources[resource_id]

    async def create_snapshot(self, resource_id: str, label: str) -> str:
        snap_id = f"snap-{uuid.uuid4().hex[:6]}"
        await logger.info("mock_snapshot_created", hw_id=resource_id, label=label)
        return snap_id
