api_key='AIzaSyCyaJEP2dIbBdQI4GObjqGTknoiaxlFCDs'
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI(title="Chat API")
from google import genai

client = genai.Client(api_key="AIzaSyCyaJEP2dIbBdQI4GObjqGTknoiaxlFCDs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Define the response model
class ChatMessage(BaseModel):
    chats: List[dict]

# Initialize a simple message store
messages = []

@app.post("/chats")
async def handle_chat(chat_message: ChatMessage):
    print(chat_message.chats)
    response = client.models.generate_content(
    model="gemini-1.5-pro", contents=str(chat_message.chats)+ "\n\n the above is a chat history , you are a mental health agent who helps heal others, give the next ai reponse")
    print(response.text)

    chat_message.chats.append({'ai': response.text})

   
    return chat_message


# Add a GET endpoint to retrieve messages (for testing)
@app.get("/messages")
async def get_messages():
    print('asdsdsdas')
    return {"messages": messages}




@app.get('/hi')
async def hhhhhhhh():
    print('sadasdadasdasd')
    return "hgjhgjhghj"


# if __name__ == "__main__":
#     uvicorn.run(app, host="localhost", port=8000)