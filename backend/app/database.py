from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings
import certifi

client: AsyncIOMotorClient = None


async def connect_db():
    global client
    client = AsyncIOMotorClient(
        settings.MONGODB_URL,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=10000,
        connectTimeoutMS=10000,
        socketTimeoutMS=10000,
    )


async def close_db():
    global client
    if client:
        client.close()


def get_db():
    return client.fitai
