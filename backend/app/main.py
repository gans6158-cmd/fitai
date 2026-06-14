from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import connect_db, close_db, get_db
from .routers import auth, users, weight, workouts, nutrition, achievements, chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(title="FitAI API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(weight.router)
app.include_router(workouts.router)
app.include_router(nutrition.router)
app.include_router(achievements.router)
app.include_router(chat.router)


@app.get("/")
async def root():
    return {"status": "FitAI API running", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.get("/db-test")
async def db_test():
    try:
        db = get_db()
        await db.users.find_one({})
        return {"status": "mongodb connected"}
    except Exception as e:
        return {"status": "mongodb error", "detail": str(e)}
