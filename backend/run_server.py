import uvicorn
import os

if __name__ == "__main__":
    # Run the FastAPI app defined in app/main.py
    # Note: reload=True can sometimes cause issues on Windows with file locks.
    # If the server shuts down immediately, try setting reload=False.
    PORT = int(os.getenv("PORT", 3000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=False)
