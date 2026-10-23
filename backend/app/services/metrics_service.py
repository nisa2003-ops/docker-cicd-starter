"""System metrics service utilizing psutil for genuine platform telemetry."""

import os
import platform
import time
from datetime import datetime, timezone
from typing import Optional, List

import psutil

from ..models.metrics import (
    CPUMetrics,
    MemoryMetrics,
    DiskMetrics,
    NetworkMetrics,
    HostInfo,
    MetricsResponse,
)
from ..logging_config import logger


def _format_duration(seconds: float) -> str:
    """Format seconds into days, hours, minutes."""
    days, rem = divmod(int(seconds), 86400)
    hours, rem = divmod(rem, 3600)
    minutes, _ = divmod(rem, 60)
    if days > 0:
        return f"{days}d {hours}h {minutes}m"
    if hours > 0:
        return f"{hours}h {minutes}m"
    return f"{minutes}m"


class MetricsService:
    """Collects genuine host performance and resource statistics."""

    @staticmethod
    def get_cpu_metrics() -> CPUMetrics:
        """Collect real-time CPU telemetry."""
        try:
            # cpu_percent with interval=None gives instant non-blocking metric
            cpu_percent = float(psutil.cpu_percent(interval=None))
            cores_logical = psutil.cpu_count(logical=True) or 1
            cores_physical = psutil.cpu_count(logical=False)

            freq_mhz: Optional[float] = None
            try:
                freq = psutil.cpu_freq()
                if freq and freq.current:
                    freq_mhz = round(freq.current, 1)
            except Exception as e:
                logger.debug(f"CPU frequency unavailable: {e}")

            load_avg: Optional[List[float]] = None
            if hasattr(psutil, "getloadavg"):
                try:
                    lavg = psutil.getloadavg()
                    load_avg = [round(x, 2) for x in lavg]
                except Exception as e:
                    logger.debug(f"getloadavg not supported: {e}")

            return CPUMetrics(
                percent=cpu_percent,
                cores_logical=cores_logical,
                cores_physical=cores_physical,
                frequency_mhz=freq_mhz,
                load_avg=load_avg,
                status="available",
            )
        except Exception as e:
            logger.error(f"Failed to gather CPU metrics: {e}")
            return CPUMetrics(
                percent=0.0,
                cores_logical=1,
                status="unavailable",
            )

    @staticmethod
    def get_memory_metrics() -> MemoryMetrics:
        """Collect real-time virtual memory telemetry."""
        try:
            mem = psutil.virtual_memory()
            gb_divider = 1024 ** 3

            return MemoryMetrics(
                total_bytes=mem.total,
                used_bytes=mem.used,
                available_bytes=mem.available,
                total_gb=round(mem.total / gb_divider, 2),
                used_gb=round(mem.used / gb_divider, 2),
                available_gb=round(mem.available / gb_divider, 2),
                percent=round(mem.percent, 1),
                status="available",
            )
        except Exception as e:
            logger.error(f"Failed to gather Memory metrics: {e}")
            return MemoryMetrics(
                total_bytes=0,
                used_bytes=0,
                available_bytes=0,
                total_gb=0.0,
                used_gb=0.0,
                available_gb=0.0,
                percent=0.0,
                status="unavailable",
            )

    @staticmethod
    def get_disk_metrics() -> DiskMetrics:
        """Collect filesystem partition storage metrics."""
        try:
            # Determine appropriate root path for platform
            if os.name == "nt":
                drive = os.path.splitdrive(os.getcwd())[0] or "C:"
                mount_path = f"{drive}\\"
            else:
                mount_path = "/"

            usage = psutil.disk_usage(mount_path)
            gb_divider = 1024 ** 3

            return DiskMetrics(
                mount_point=mount_path,
                total_bytes=usage.total,
                used_bytes=usage.used,
                free_bytes=usage.free,
                total_gb=round(usage.total / gb_divider, 2),
                used_gb=round(usage.used / gb_divider, 2),
                free_gb=round(usage.free / gb_divider, 2),
                percent=round(usage.percent, 1),
                status="available",
            )
        except Exception as e:
            logger.error(f"Failed to gather Disk metrics: {e}")
            return DiskMetrics(
                mount_point="unknown",
                total_bytes=0,
                used_bytes=0,
                free_bytes=0,
                total_gb=0.0,
                used_gb=0.0,
                free_gb=0.0,
                percent=0.0,
                status="unavailable",
            )

    @staticmethod
    def get_network_metrics() -> NetworkMetrics:
        """Collect cumulative network traffic I/O telemetry."""
        try:
            net = psutil.net_io_counters()
            mb_divider = 1024 ** 2

            if net:
                return NetworkMetrics(
                    bytes_sent=net.bytes_sent,
                    bytes_recv=net.bytes_recv,
                    mb_sent=round(net.bytes_sent / mb_divider, 2),
                    mb_recv=round(net.bytes_recv / mb_divider, 2),
                    packets_sent=net.packets_sent,
                    packets_recv=net.packets_recv,
                    status="available",
                )
        except Exception as e:
            logger.error(f"Failed to gather Network metrics: {e}")

        return NetworkMetrics(
            bytes_sent=0,
            bytes_recv=0,
            mb_sent=0.0,
            mb_recv=0.0,
            packets_sent=0,
            packets_recv=0,
            status="unavailable",
        )

    @staticmethod
    def get_host_info() -> HostInfo:
        """Collect operating system platform and boot time."""
        boot_timestamp = psutil.boot_time()
        now = time.time()
        uptime_sec = max(0.0, now - boot_timestamp)

        boot_dt = datetime.fromtimestamp(boot_timestamp, tz=timezone.utc)
        os_name = f"{platform.system()} {platform.release()} ({platform.machine()})"

        return HostInfo(
            platform=os_name,
            boot_time_iso=boot_dt.isoformat(),
            uptime_seconds=round(uptime_sec, 1),
            uptime_formatted=_format_duration(uptime_sec),
        )

    @classmethod
    def collect_all_metrics(cls) -> MetricsResponse:
        """Assemble complete system telemetry response."""
        now_iso = datetime.now(timezone.utc).isoformat()
        cpu = cls.get_cpu_metrics()
        memory = cls.get_memory_metrics()
        disk = cls.get_disk_metrics()
        network = cls.get_network_metrics()
        host = cls.get_host_info()

        overall_status = "available"
        if cpu.status == "unavailable" or memory.status == "unavailable":
            overall_status = "degraded"

        return MetricsResponse(
            status=overall_status,
            timestamp=now_iso,
            is_live_data=True,
            cpu=cpu,
            memory=memory,
            disk=disk,
            network=network,
            host=host,
        )


metrics_service = MetricsService()
