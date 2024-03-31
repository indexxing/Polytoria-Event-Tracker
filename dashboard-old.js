/*
    Extension created by Index (user ID 2782 on Polytoria)
    Checkmark icon from Microsoft's FluentUI Flat Icons Pack
*/

let EggData;
let ItemIDs;
let UserID;
let Inventory;

let Column;
let Card;
const Elements = {}

let CollectedEggCount = 0;
let ItemInfoCache;
chrome.storage.local.get('INDEX-EGG-HUNT-24-ITEM-INFO', async function(result) {
    result = result["INDEX-EGG-HUNT-24-ITEM-INFO"]

    ItemInfoCache = result || {
        items: {},
        requested: new Date().getTime()
    }

    if (new Date(ItemInfoCache.requested).getDate() !== new Date().getDate()) {
        console.log('Cache is old')
        ItemInfoCache = {
            items: {},
            requested: new Date().getTime()
        }
    }
    
    EggData = await fetch(chrome.runtime.getURL('data.json'))
    EggData = await EggData.json()

    //const ItemIDs = EggData.itemIDs
    ItemIDs = [
        25614,
        25186,
        32595,
        32333,
        32185
    ].toSorted((a, b) => b - a)
    
    document.addEventListener('DOMContentLoaded', async function(){
        UserID = document.querySelector('.text-reset.text-decoration-none[href^="/users/"]').getAttribute('href').split('/')[2]
        Inventory = await fetch(`https://api.polytoria.com/v1/users/${UserID}/inventory?type=hat&limit=50`)
        Inventory = await Inventory.json()

        Column = document.getElementById('main-content').getElementsByClassName('col-lg-8')[0]

        Card = document.createElement('div')
        Card.id = 'INDEX-EGG-HUNT-24'
        Card.classList = 'card card-dash mcard mt-4 mb-4'
        Card.style = 'background: linear-gradient(rgba(0, 0, 0, 0.6),rgba(0, 0, 0, 0.6)),/*url(\'https://c0.ptacdn.com/places/thumbnails/vc0mUHxVd399ftZDvAFvH7CDV_DdJWdl.png\')*/url(\'https://c0.ptacdn.com/places/thumbnails/O6TVrQfkFeEMyG5ZVE5Wb_bOT_kLtONK.png\');background-size: cover;background-position: center;'
        Card.innerHTML = `
        <!--
            Extension created by Index (user ID 2782 on Polytoria)
            Checkmark icon from Microsoft's FluentUI Flat Icons Pack
        -->
        <div class="card-body pb-0">
            <div class="row w-100">
                <div class="col">
                    <h3>EGG HUNT 2024!</h3>
                    <a href="/places/8682" class="btn btn-primary btn-sm" id="INDEX-EGG-HUNT-24-PLAY">Hop on!</a>
                    <a href="/my/avatar/" class="btn btn-success btn-sm">Customize your Avatar!</a>
                </div>
                <div class="col-md-2 text-center">
                    <small class="text-muted text-uppercase">Event Progress</small>
                    <h2 id="INDEX-EGG-HUNT-24-PROGRESS">-%</h2>
                </div>
                <div class="col-md-2 text-center">
                    <small class="text-muted text-uppercase">Eggs Collected</small>
                    <h2 id="INDEX-EGG-HUNT-24-COLLECTED">-/${ItemIDs.length}</h2>
                </div>
            </div>
            <!-- Progress bar hidden because I think it takes up too much space -->
            <div class="progress my-3 d-none" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar progress-bar-striped text-bg-primary" style="width: 0%" id="INDEX-EGG-HUNT-24-PROGRESS-BAR">-%</div>
            </div>
            <hr>
            <div class="card-body p-0 m-1 mb-0 scrollFadeContainer d-flex">
                <span class="text-center">LOADING... CREATED BY INDEX</span>
            </div>
            <div class="row text-center mt-4">
                <div class="col-auto">
                    <button class="btn btn-primary btn-sm" id="INDEX-EGG-HUNT-24-REFRESH"><i class="fa-solid fa-rotate-right"></i></button>
                </div>
                <div class="col">
                    <small>hunt tracker created by <a href="/users/2782" target="_blank">Index</a> :)</small>
                </div>
            </div>
        </div>
        `
        Column.prepend(Card)

        Elements["ItemRow"] = document.getElementById('INDEX-EGG-HUNT-24').getElementsByClassName('card-body d-flex')[0]
        Elements["Collected"] = document.getElementById('INDEX-EGG-HUNT-24-COLLECTED')
        Elements["Progress"] = document.getElementById('INDEX-EGG-HUNT-24-PROGRESS')
        Elements["ProgressBar"] = document.getElementById('INDEX-EGG-HUNT-24-PROGRESS-BAR')
        Elements["Play"] = document.getElementById('INDEX-EGG-HUNT-24-PLAY')
        Elements["Refresh"] = document.getElementById('INDEX-EGG-HUNT-24-REFRESH')

        LoadItems()

        Elements.Refresh.addEventListener('click', function() {
            Elements.Refresh.disabled = true
            LoadItems()
            setTimeout(function () {
                Elements.Refresh.disabled = false
            }, 3500)
        })
    })
})

/*
    This function was updated from it's original code with the use of AI
    The code has still been reviewed and updated to fit my code style
*/
function LoadItems() {
    Elements.ItemRow.innerHTML = ``
    CollectedEggCount = 0

    const ItemResult = ItemIDs.map(async (id) => {
        let ItemInfo;
        if (ItemInfoCache.items[id] === undefined) {
            console.log('Not using cache', id)
            const response = await fetch('https://api.polytoria.com/v1/store/' + id)
            ItemInfo = await response.json();
            ItemInfoCache.items[id] = ItemInfo
        } else {
            console.log('Using cache', id)
            ItemInfo = ItemInfoCache.items[id]
        }

        let ItemOwned = OwnsItem(id)
        if (ItemOwned === true) { CollectedEggCount++ }

        const ItemCard = document.createElement('a');
        ItemCard.href = '/store/' + id
        ItemCard.innerHTML = `
        <div class="scrollFade card me-2 place-card force-desktop text-center mb-2" style="background: transparent;">
            <div class="card-body">
                <img src="${ItemInfo.thumbnail}" class="img-fluid place-card-image" alt="${ItemInfo.name} Item Thumbnail" ${ItemOwned === false ? 'style="filter: brightness(0);"' : ''}>
                <div>
                    <div class="place-card-title text-center p-2" style="font-size: 0.8rem;">
                        ${ItemInfo.name}
                    </div>
                </div>
            </div>
            ${ItemOwned === true ? '<div style="position: absolute; top: calc(50% - 15.5px); left: calc(50% - 15.5px); margin-top: 30px;"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6C2 3.79086 3.79086 2 6 2H26C28.2091 2 30 3.79086 30 6V26C30 28.2091 28.2091 30 26 30H6C3.79086 30 2 28.2091 2 26V6Z" fill="#00D26A"/><path d="M13.242 23C12.8588 23 12.4757 22.8566 12.183 22.5692L6.43855 16.9278C5.85382 16.3535 5.85382 15.422 6.43855 14.8477C7.02329 14.2735 7.97186 14.2735 8.55659 14.8477L13.242 19.4491L23.4434 9.43069C24.0281 8.85644 24.9767 8.85644 25.5614 9.43069C26.1462 10.0049 26.1462 10.9365 25.5614 11.5107L14.301 22.5692C14.009 22.8566 13.6252 23 13.242 23Z" fill="#F4F4F4"/></svg></div>' : ''}
        </div>
        `;

        return ItemCard;
    });

    Promise.all(ItemResult).then(items => {
        const SortedItems = items.sort((a, b) => parseInt(b.href.split('/')[4]) - parseInt(a.href.split('/')[4]));
        SortedItems.forEach(item => Elements.ItemRow.appendChild(item));

        ItemInfoCache.requested = new Date().getTime();
        chrome.storage.local.set({'INDEX-EGG-HUNT-24-ITEM-INFO': ItemInfoCache}, function() {
            console.log('Saved item info cache');
        });

        Elements.Collected.innerText = CollectedEggCount + '/' + ItemIDs.length;
        const EventProgressPercentage = ((CollectedEggCount * 100) / ItemIDs.length).toFixed(0);
        Elements.Progress.innerText = EventProgressPercentage + '%';
        Elements.ProgressBar.style.width = EventProgressPercentage + '%';
    }).catch(error => {
        console.error('Error loading items:', error)
    });
}

function OwnsItem(id) {
    let Result = false
    Inventory.inventory.forEach(item => {
        if (item.asset.id === id) {
            Result = true
        }
    })
    return Result
}