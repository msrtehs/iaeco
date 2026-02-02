import { GoogleGenAI, Type } from "@google/genai";
import { WasteAnalysis } from '../types';

const getClient = () => {
  const rawKey = process.env.API_KEY || '';
  let apiKey = rawKey;
  
  try {
    // Decodifica a chave que está em Base64 no .env.local
    if (rawKey) {
        apiKey = atob(rawKey);
    }
  } catch (e) {
    console.warn("Falha ao decodificar chave API em Base64, tentando uso direto.");
    apiKey = rawKey;
  }
  
  return new GoogleGenAI({ apiKey });
};

export const getChatResponse = async (
  message: string, 
  history: string[] = []
): Promise<{ text: string; actions?: any[] }> => {
  const ai = getClient();
  
  const systemInstruction = `
    Você é o "EcoAssist", um assistente virtual especialista em gestão de resíduos e meio ambiente do app IAeco.
    Sua missão é educar o cidadão, tirar dúvidas sobre reciclagem e agendar coletas.
    
    Regras:
    1. Seja cordial, use emojis ecológicos (🌱, ♻️, 🚛).
    2. Responda com base na realidade de um município padrão brasileiro (coleta seletiva vs comum).
    3. Se o usuário perguntar "onde descarto X", classifique e diga o destino.
    4. Mantenha respostas curtas e objetivas (máx 3 parágrafos curtos).
    5. Se não tiver certeza se um item é perigoso (ex: pilhas, remédios), instrua a levar em ponto de coleta específico.
    6. Se o usuário disser que quer jogar fora algo grande (sofá, geladeira), sugira "Solicitar Coleta".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const text = response.text || "Desculpe, não consegui processar sua dúvida agora. Tente novamente.";
    
    // Simple heuristic to add actions based on keywords in the AI response
    let actions = [];
    if (text.toLowerCase().includes("coleta") || text.toLowerCase().includes("agendar")) {
      actions.push({ label: "Solicitar Coleta", action: "goto_request" });
    }
    if (text.toLowerCase().includes("ponto") || text.toLowerCase().includes("mapa")) {
      actions.push({ label: "Ver Mapa", action: "open_map" });
    }

    return { text, actions };
  } catch (error) {
    console.error("Error in chat:", error);
    return { text: "Estou tendo dificuldades para conectar ao servidor ecológico. 🍃 Tente novamente em instantes." };
  }
};

export const analyzeWasteDescription = async (description: string): Promise<WasteAnalysis> => {
  const ai = getClient();

  const prompt = `
    Analise a descrição deste resíduo: "${description}".
    Classifique-o para um sistema de coleta municipal.
    Categorias possíveis: Reciclável, Orgânico, Volumoso (móveis/grandes), Eletrônico, Perigoso (químico/hospitalar), Comum (rejeito), Poda (jardim).
    Retorne JSON puro.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            destination: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["category", "recommendation", "destination", "confidence"]
        }
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText) as WasteAnalysis;
  } catch (error) {
    console.error("Error analyzing waste:", error);
    // Fallback
    return {
      category: "Indefinido",
      recommendation: "Por favor, forneça mais detalhes.",
      destination: "Análise manual necessária",
      confidence: 0
    };
  }
};

export const getAdminInsights = async (mockDataSummary: string): Promise<{ summary: string; trend: string; suggestion: string }> => {
  const ai = getClient();

  const prompt = `
    Você é um analista de dados urbanos. Analise este resumo de dados de coleta de lixo:
    ${mockDataSummary}
    
    Gere 3 insights curtos em JSON:
    1. 'summary': Resumo geral da situação.
    2. 'trend': Uma tendência observada (ex: aumento de algo).
    3. 'suggestion': Uma ação prática para a prefeitura.
  `;

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
         responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            trend: { type: Type.STRING },
            suggestion: { type: Type.STRING },
          },
          required: ["summary", "trend", "suggestion"]
        }
      }
    });
     const jsonText = response.text || "{}";
     return JSON.parse(jsonText);
  } catch (error) {
    return {
      summary: "Dados insuficientes para análise no momento.",
      trend: "Estável",
      suggestion: "Monitorar coletas manuais."
    };
  }
};

export const generateEcoTip = async (category: string): Promise<string> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere uma única dica curta (máximo 15 palavras) e impactante sobre como descartar ou reduzir resíduos do tipo: ${category}. Use tom educativo e amigável.`,
    });
    return response.text || "Recicle sempre que possível! ♻️";
  } catch {
    return "Obrigado por colaborar com a cidade limpa! 🌿";
  }
}