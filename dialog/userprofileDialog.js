const { InputHints, MessageFactory,AttachmentLayoutTypes } = require('botbuilder');
const { ConfirmPrompt, ChoicePrompt ,TextPrompt, WaterfallDialog,Prompt } = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder-core');

const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const { displayTrendingMovies , searchMovies} = require('../api/movieDB');
const {validateEmail} = require('../validateEmail');
const MenuCard = require('../menu.json');
const carouselTemplate = require('../carousel.json');

const CONFIRM_PROMPT = 'confirmPrompt';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';
const CARD_PROMPT = "cardPrompt";
const REVIEW_SELECTION_DIALOG = "REVIEW_SELECTION_DIALOG"

class UserProfileDialog extends CancelAndHelpDialog{
    constructor(id){
        super(id || 'userProfileDialog');
        this.userProfileDialog = new WaterfallDialog(WATERFALL_DIALOG,[
            this.nameStep.bind(this),
            this.loopStep.bind(this),
            this.emialStep.bind(this),
            this.confirmationStep.bind(this),
            this.authenticationStep.bind(this),
            this.authenticationValidationStep.bind(this),
            this.displayTrendingMovieStep.bind(this),
            this.moviePromptStep.bind(this),
            this.processMovieInput.bind(this),
            this.finalStep.bind(this)
        ])

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new ChoicePrompt(CARD_PROMPT))
            .addDialog(new TextPrompt(REVIEW_SELECTION_DIALOG))
            .addDialog(this.userProfileDialog);
            this.initialDialogId = WATERFALL_DIALOG;
    }

    async nameStep(stepContext){
        const userInfo = stepContext.options;

        if(!userInfo.name){
            const messageText = 'Enter username';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt:msg });
        }
        return await stepContext.next(userInfo.name);
    }

    async loopStep(stepContext) {
        try{
            const result = stepContext.result;
        
            //validate user inputed a string length not greater than 5
            if(!isNaN(result) && result.length > 5 || !isNaN(result) || result.length > 5){
              const errorMessageText = 'Username invalid. Please enter a valid username \n \n Username must be string of characters and length must not be greater than 5';
              const msg = MessageFactory.text(errorMessageText, errorMessageText, InputHints.ExpectingInput);
              await stepContext.prompt(TEXT_PROMPT, {prompt:msg});
              
              return await stepContext.replaceDialog(WATERFALL_DIALOG, { stepIndex: 1 });
            }
            else{
                return await stepContext.next(result); 
            }
        }
        catch(error){
            console.error('Error in dialog:', error);

            await stepContext.context.sendActivity('An error occurred. Please try again later.');
        
            return await stepContext.endDialog();
        }
    }

    async emialStep(stepContext){
        const userInfo = stepContext.options;

        userInfo.name = stepContext.result;
        if(!userInfo.email){
            const messageText = "Enter email address";
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt:msg });
        }
        return await stepContext.next(userInfo.email);
    }

    async confirmationStep(stepContext){
        const userInfo = stepContext.options;

        userInfo.email = stepContext.result;

            if(validateEmail(userInfo.email)){
                // const movieData = await fetchData();
                const messageText = `Please confirm, I have your name as: ${userInfo.name} and email as: ${userInfo.email}. Is this correct?`;
                const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        
                return await stepContext.prompt(CONFIRM_PROMPT, { prompt:msg });
            }
            else{
                const errorMessageText = 'Email invalid. Please enter a valid email';
                const msg = MessageFactory.text(errorMessageText, errorMessageText, InputHints.ExpectingInput);
    
                await stepContext.prompt(TEXT_PROMPT, {prompt:msg});
                return await stepContext.replaceDialog(WATERFALL_DIALOG, { stepIndex: 2 });
            }
    }

    async authenticationStep(stepContext){
        const userInfo = stepContext.options;

        if(!userInfo.authKey){
            const messageText = "Please enter authentication key";
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    
            return await stepContext.prompt(TEXT_PROMPT, {prompt: msg});
        }
        return await stepContext.next();
    }

    async authenticationValidationStep(stepContext){
       
        const authKey = "11223344";
        const result = stepContext.result;

        if(result !== authKey){
            stepContext.context.sendActivity("Invalid passKey");
            return await stepContext.replaceDialog(WATERFALL_DIALOG, { stepIndex: 3});    
        }
        else{
            return await stepContext.next();
        }
    }

    async displayTrendingMovieStep(stepContext){
     stepContext.context.sendActivity({ attachments : await this.displayCarousel(stepContext),
                                        attachmentLayout: AttachmentLayoutTypes.Carousel
                                        });
        return await stepContext.next();
    }

    async moviePromptStep(stepContext){
        const MessageText = "What movie would you like to see?"
        const msg = MessageFactory.text(MessageText, MessageText, InputHints.ExpectingInput);

        return await stepContext.prompt(TEXT_PROMPT, {prompt : msg});
    }

    async processMovieInput(stepContext){
        const userInfo = stepContext.options;
        userInfo.searchInput = stepContext.result;

        if(!userInfo.searchInput){
            return await stepContext.replaceDialog(WATERFALL_DIALOG, { stepIndex: 6});
        }
        await searchMovies(stepContext,userInfo.searchInput);
        return await this.userProfileDialog.runStep(stepContext, 7, "reprompt");
    }

    async finalStep(stepContext){
        stepContext.context.sendActivity(`Welcome ${stepContext.options.name}`);

        const userInfo = stepContext.options;
        const welcomeCard = CardFactory.adaptiveCard(MenuCard);
        await stepContext.context.sendActivity({ attachments : [welcomeCard]});
        
        return await stepContext.endDialog(userInfo);
    }

    async displayCarousel(stepContext){
        const trendingMoviesData = await displayTrendingMovies(stepContext);

        const movieCards = await trendingMoviesData.map((item)=>{
            
            return CardFactory.adaptiveCard(
                    {
                        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                        "type": "AdaptiveCard",
                        "version": "1.0",
                        "body": [
                            {
                               "type": "Image",
                               "url": `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                               "altText": "movieCard",
                               "size": "170px",
                               "text": "Default text input"
                            }
                        ],
                        "actions": [
                            {
                               "type": "Action.OpenUrl",
                               "title": "View Details",
                               "url": `https://www.themoviedb.org/movie/${item.id}`
                            }
                        ]
                    }
                )
            
        })
        return await movieCards;
    }
}

module.exports.UserProfileDialog = UserProfileDialog;