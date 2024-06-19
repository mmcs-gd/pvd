import EndGameWindow from '../src/UI/end-game-window.js';

export default class LoseWindowScene extends Phaser.Scene 
{
    constructor() 
    {
        super({ key: 'LoseWindowScene' });
    }

    preload() 
    {
        EndGameWindow.preload(this, 'lose-window');
    }

    create()
    {
        this.LoseWindow = new EndGameWindow(this,'Победа');
    }
}