/*
    Extension created by Index (user ID 2782 on Polytoria)

    Access this page by going to: https://polytoria.com/my/avatar?eggHunt=2024
    This page was meant for before the egg hunt was released
*/

!(async () => {
    const PageContainer = document.querySelector('.container.p-0.p-lg-5')
    PageContainer.innerHTML = `
    <!--
        Extension created by Index (user ID 2782 on Polytoria)
    -->
    <div class="row">
        <div class="col-md-4">
            <iframe frameborder="0" id="avatar-iframe" class="w-100" height="450"></iframe>
        </div>
        <div class="col">
            <ul class="list-unstyled" id="item-options"></ul>
        </div>
    </div>
    `

    let Data = await fetch(chrome.runtime.getURL('data.json'))
    Data = await Data.json()

    const EggItemIDs = Data.itemIDs
    // 32357 for egg launcher^

    const EggItemNames = Data.itemNames

    let Avatar = {
        "useCharacter": true,
        "items": [],
        "shirt": 24118,
        "pants": 24123,
        "headColor": "#e0e0e0",
        "torsoColor": "#e0e0e0",
        "leftArmColor": "#e0e0e0",
        "rightArmColor": "#e0e0e0",
        "leftLegColor": "#e0e0e0",
        "rightLegColor": "#e0e0e0"
    }

    const UserID = document.querySelector('.text-reset.text-decoration-none[href^="/users/"]').getAttribute('href').split('/')[2]

    const ItemOptions = $('#item-options')
    const AvatarIFrame = $('#avatar-iframe')

    const AvatarInfo = await GetAvatarInfo(UserID)

    // Hats and Tools are intentionally not added
    AvatarInfo.assets.forEach(item => {
        switch(item.type) {
            case 'face':
                Avatar.face = item.path
                break
            case 'shirt':
                Avatar.shirt = item.path
                break
            case 'pants':
                Avatar.pants = item.path
                break
        }
    })

    Avatar.headColor = "#"+AvatarInfo.colors.head
    Avatar.torsoColor = "#"+AvatarInfo.colors.torso
    Avatar.leftArmColor = "#"+AvatarInfo.colors.leftArm
    Avatar.rightArmColor = "#"+AvatarInfo.colors.rightArm
    Avatar.leftLegColor = "#"+AvatarInfo.colors.leftLeg
    Avatar.rightLegColor = "#"+AvatarInfo.colors.rightLeg

    AvatarIFrame.src = "https://polytoria.com/ptstatic/itemview/#" + EncodeAvatarRes(Avatar)

    for (let i = 0; i < EggItemIDs.length; i+=2) {
        if (EggItemIDs[i] === undefined) { return }
        const Row = document.createElement('li')
        Row.classList = 'row mb-2'
        Row.innerHTML = `
        <div class="col">
            <button class="btn btn-dark btn-sm w-100">${ (EggItemNames[EggItemIDs[i]] !== undefined) ? `${ EggItemNames[EggItemIDs[i]] } <small class="text-muted fw-light">${EggItemIDs[i]}</small>` : EggItemIDs[i] }</button>
        </div>
        <div class="col">
            <button class="btn btn-dark btn-sm w-100">${ (EggItemNames[EggItemIDs[i+1]] !== undefined) ? `${ EggItemNames[EggItemIDs[i+1]] } <small class="text-muted fw-light">${EggItemIDs[i+1]}</small>` : EggItemIDs[i+1] }</button>
        </div>
        `
        ItemOptions.appendChild(Row)

        const Button1 = Row.getElementsByTagName('button')[0]
        Button1.addEventListener('click', function() {
            Button1.classList.add('btn-success')
            Button1.classList.remove('btn-dark')

            WearItem(EggItemIDs[i], Button1)
        })

        const Button2 = Row.getElementsByTagName('button')[1]
        Button2.addEventListener('click', function() {
            Button2.classList.add('btn-success')
            Button2.classList.remove('btn-dark')

            WearItem(EggItemIDs[i+1], Button2)
        })
    }

    const EggCount = document.createElement('li')
    EggCount.classList = 'text-muted text-uppercase text-center mt-3'
    EggCount.style.fontSize = '0.7rem;'
    EggCount.innerText = EggItemIDs.length + ' total eggs'

    ItemOptions.appendChild(document.createElement('hr'))
    ItemOptions.appendChild(EggCount)

    function WearItem(id, thisButton) {
        fetch('https://api.polytoria.com/v1/assets/serve-mesh/' + id)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network not ok')
                }
                return response.json()
            })
            .then(data => {
                console.log('Equip Item', id)
                Array.from(PageContainer.getElementsByTagName('button')).forEach(button => {
                    if (button !== thisButton) {
                        button.classList.add('btn-dark')
                        button.classList.remove('btn-success')
                    }
                })
                if (id !== null) {
                    Avatar.items = [
                        data.url
                    ]
                } else {
                    Avatar.items = []
                }
                const Hash = EncodeAvatarRes(Avatar)
                AvatarIFrame.addEventListener('load', function () {
                    AvatarIFrame.src = 'https://polytoria.com/ptstatic/itemview/#' + Hash;
                });
                AvatarIFrame.src = 'about:blank'
            })
            .catch(error => {console.log(error)})
    }

    // FormatAvatar function taken from one of my other projects https://github.com/indexxing/PolyPlus
    async function FormatAvatar() {
        const FormattedAvatar = structuredClone(Avatar)

        // Hats, Tools: https://api.polytoria.com/v1/assets/serve-mesh/:id
        // or: https://api.polytoria.com/v1/assets/serve/:id/Asset

        Avatar.items.forEach(async (item, index) => {
            if (typeof(item) === 'number') {
                console.log(item)
                await FetchMesh(item)
                    .then(URL => {
                        console.log('URL: ' + URL)
                        FormattedAvatar.items[index] = URL
                    })
                    .catch(error => {
                        throw new Error(error)
                    });
            }
        });

        if (typeof(FormattedAvatar.tool) === 'number') {console.log(FormattedAvatar.tool); FormattedAvatar.tool = await FetchMesh(FormattedAvatar.tool)}

        if (FormattedAvatar.face && typeof(FormattedAvatar.face) === 'number') {
            FormattedAvatar.face = await FetchAsset(FormattedAvatar.face)
        } else {
            FormattedAvatar.face = "https://c0.ptacdn.com/static/3dview/DefaultFace.png"
        }

        if (typeof(FormattedAvatar.shirt) === 'number') {FormattedAvatar.shirt = await FetchAsset(FormattedAvatar.shirt)}
        if (typeof(FormattedAvatar.pants) === 'number') {FormattedAvatar.pants = await FetchAsset(FormattedAvatar.pants)}

        console.log('Real Avatar: ', Avatar, 'Formatted: ', FormattedAvatar)
        return FormattedAvatar
    }

    function EncodeAvatarRes(res) { return btoa(encodeURIComponent(JSON.stringify(res))) }

    async function GetUserID(username) {
        return fetch('https://api.polytoria.com/v1/users/find?username='+username)
            .then(response => {
                if (!response.ok) {
                    throw new Error('GetUserID - Network not ok')
                }
                return response.json()
            })
            .then(data => {
                return data.id
            })
            .catch(error => {
                return 'ERROR'
                console.log('GetUserID - ' + error)
            });
    }

    async function GetAvatarInfo(userID) {
        return fetch('https://api.polytoria.com/v1/users/'+userID+'/avatar/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('GetAvatarInfo - Network not ok')
                }
                return response.json()
            })
            .then(data => {
                return data
            })
            .catch(error => {
                return 'ERROR'
                console.log('GetAvatarInfo - ' + error)
            });
    }

    function $(query) {return document.querySelector(query)}
})()