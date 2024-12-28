from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from langchain_openai import OpenAIEmbeddings
# from langchain_community.llms import OpenAI
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
import os
import tempfile
import faiss
import dotenv
from openai import OpenAI


dotenv.load_dotenv()
app = Flask(__name__)
CORS(app)


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OpenAI API key not found in environment variables.")


embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
client = OpenAI()
vector_db = None


@app.route('/')
def index():
    return "Healthy!", 200


@app.route('/upload-file', methods=['POST'])
def upload_file():
    global vector_db

    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        file.save(temp_file.name)
        loader = PyPDFLoader(temp_file.name)
        documents = loader.load()

    if vector_db is None:
        vector_db = FAISS.from_documents(documents, embeddings)
    else:
        vector_db.add_documents(documents)

    return jsonify({"message": "File successfully processed and added to the vector database"}), 200



@app.route('/api/chat', methods=['POST'])
def chat():
    global vector_db

    data = request.json
    if not data or 'query' not in data:
        return jsonify({"error": "Missing 'query' in request body"}), 400
    
    # print(data)

    query = data['query']
    try:
        message_history = data['history']
    except KeyError:
        message_history = []

    if vector_db is not None:
        results = vector_db.similarity_search(query, k=3)
        context = " ".join([doc.page_content for doc in results])
    else:
        context = ""

    # print(context)

    def stream_response():
        try:
            messages = [
                {"role": "system", "content": f"Use the following context for answering: {context}"},
                {"role": "system", "content": f"You have access to the previous messages in this conversation, please use it when it is required: {str(message_history)}. Make sure to always align your answers with the context."},
                {"role": "user", "content": query}
            ]

            # print(messages)

            stream = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                stream=True
            )

            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            yield f"Error: {str(e)}"

    return Response(stream_response(), content_type="text/event-stream")


if __name__ == '__main__':
    app.run(debug=True, port=8000)
