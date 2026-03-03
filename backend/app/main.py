from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import auth, resumes

# In a production app with migrations, we'd use Alembic. 
# For this initial setup, we'll create tables directly.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Resulyze AI Resume Analyzer")

# CORS configuration
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(resumes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Resulyze AI API"}
