import os
import google.generativeai as genai
from dotenv import load_dotenv

# Carrega a sua chave do .env
load_dotenv()
chave = os.getenv("GEMINI_API_KEY")

if not chave:
    print("ERRO: A chave não foi encontrada no .env!")
else:
    genai.configure(api_key=chave)
    print("Conectando ao Google...\nModelos liberados para a sua chave:")
    
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
    except Exception as e:
        print(f"Erro ao listar modelos: {e}")