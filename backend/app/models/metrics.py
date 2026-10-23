"""System metrics response models using psutil."""

from typing import List, Optional
from pydantic import BaseModel, Field


class CPUMetrics(BaseModel):
    percent: float = Field(..., description="Current system-wide CPU utilization percentage (genuine)")
    cores_logical: int = Field(..., description="Number of logical CPU cores")
    cores_physical: Optional[int] = Field(default=None, description="Number of physical CPU cores")
    frequency_mhz: Optional[float] = Field(default=None, description="Current CPU frequency in MHz")
    load_avg: Optional[List[float]] = Field(
        default=None,
        description="System load average [1m, 5m, 15m] where supported by host OS (null if unsupported)"
    )
    status: str = Field(default="available", description="Metric availability status")


class MemoryMetrics(BaseModel):
    total_bytes: int = Field(..., description="Total physical memory in bytes")
    used_bytes: int = Field(..., description="Used physical memory in bytes")
    available_bytes: int = Field(..., description="Available physical memory in bytes")
    total_gb: float = Field(..., description="Total memory formatted in Gigabytes")
    used_gb: float = Field(..., description="Used memory formatted in Gigabytes")
    available_gb: float = Field(..., description="Available memory formatted in Gigabytes")
    percent: float = Field(..., description="Memory utilization percentage")
    status: str = Field(default="available", description="Metric availability status")


class DiskMetrics(BaseModel):
    mount_point: str = Field(..., description="Monitored filesystem partition mount path")
    total_bytes: int = Field(..., description="Total filesystem space in bytes")
    used_bytes: int = Field(..., description="Used filesystem space in bytes")
    free_bytes: int = Field(..., description="Free filesystem space in bytes")
    total_gb: float = Field(..., description="Total disk space in Gigabytes")
    used_gb: float = Field(..., description="Used disk space in Gigabytes")
    free_gb: float = Field(..., description="Free disk space in Gigabytes")
    percent: float = Field(..., description="Disk utilization percentage")
    status: str = Field(default="available", description="Metric availability status")


class NetworkMetrics(BaseModel):
    bytes_sent: int = Field(..., description="Total cumulative bytes sent across network interfaces")
    bytes_recv: int = Field(..., description="Total cumulative bytes received across network interfaces")
    mb_sent: float = Field(..., description="Megabytes sent")
    mb_recv: float = Field(..., description="Megabytes received")
    packets_sent: int = Field(..., description="Network packets transmitted")
    packets_recv: int = Field(..., description="Network packets received")
    status: str = Field(default="available", description="Metric availability status")


class HostInfo(BaseModel):
    platform: str = Field(..., description="Operating system platform details")
    boot_time_iso: str = Field(..., description="Host system boot timestamp in ISO 8601")
    uptime_seconds: float = Field(..., description="Host system uptime in seconds")
    uptime_formatted: str = Field(..., description="Formatted host uptime duration")


class MetricsResponse(BaseModel):
    status: str = Field(default="available", description="Telemetry collection health status")
    timestamp: str = Field(..., description="Metrics sample timestamp in ISO 8601 UTC")
    is_live_data: bool = Field(default=True, description="Indicates metrics represent genuine host readings")
    cpu: CPUMetrics
    memory: MemoryMetrics
    disk: DiskMetrics
    network: NetworkMetrics
    host: HostInfo
