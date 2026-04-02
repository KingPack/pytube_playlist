import ipaddress

from fastapi import HTTPException


def validate_ip(ip: str) -> str:
    try:
        ipaddress.ip_address(ip)
        return ip
    except ValueError:
        raise HTTPException(status_code=400, detail="IP not valid.")
    