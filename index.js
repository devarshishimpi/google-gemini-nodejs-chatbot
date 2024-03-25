import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import chalk from 'chalk';
import ora from 'ora';
import prompt from 'prompt-sync';

const promptSync = prompt();

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "YOUR_API_KEY";

async function runChat() {
    const spinner = ora('Initializing chat...').start();
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };

        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [],
        });

        spinner.stop();

        while (true) {
            const userInput = promptSync(chalk.green('You: '));
            if (userInput.toLowerCase() === 'exit') {
                console.log(chalk.yellow('Goodbye!'));
                process.exit(0);
            }
            const result = await chat.sendMessage(userInput);
            const response = result.response;
            console.log(chalk.blue('AI:'), response.text());
        }
    } catch (error) {
        spinner.stop();
        console.error(chalk.red('An error occurred:'), error.message);
        process.exit(1);
    }
}

runChat();
