/*
    Extension created by Index (user ID 2782 on Polytoria)
    Checkmark icon from Microsoft's FluentUI Flat Icons Pack
*/

let Column;
let IFrame;

document.addEventListener('DOMContentLoaded', async function(){
    UserID = document.querySelector('.text-reset.text-decoration-none[href^="/users/"]').getAttribute('href').split('/')[2]

    Column = document.getElementById('main-content').getElementsByClassName('col-lg-8')[0]

    IFrame = document.createElement('iframe')
    IFrame.classList = 'mt-2 mb-2'
    IFrame.style.width = '100%'
    IFrame.style.height = '440px'
    IFrame.src = 'https://poly-egg-track.vercel.app/api?userID=' + UserID
    Column.prepend(IFrame)
})