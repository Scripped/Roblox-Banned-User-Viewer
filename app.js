#! /usr/bin/env node

import fetch from 'node-fetch';
import fs from 'fs'
import colors from 'colors'
import PromptSync from 'prompt-sync'
import nodeBashTitle from 'node-bash-title';
import yargs from 'yargs';

const prompt = PromptSync();

const usage = "\nUsage: view <username/ID>";
var argv = yargs(process.argv.slice(2))
      .usage(usage)                                                                                                    
      .help(true)  
      .argv;



function log(txt) {
    console.log('[X] '.brightRed + txt)
}

function error(txt) {
    console.log('[!] '.brightRed + txt.toUpperCase())
}
function pprompt(txt) {
    return prompt('[X] '.brightRed + '>> ' + txt.toUpperCase().brightWhite); 
} 

function showErr() {
    error('An error occurred')
    pprompt('Press any key to quit')
    return process.exit(1)
}

var base = {}
var info = []

async function f(url, res, txt, num) {
    var response = await fetch(url);
    var data = await response.json(); 
    var dataAr = Array.of(data);
    var re = res.split(',');
    var txt = txt.split(',')
    for (let i = 0; i < dataAr.length; i++) {
        info[num] += '\n\n'
        for (let n = 0; n < re.length; n++) {
            const el = re[n];
            console.log(txt[n].brightRed + ': '+ dataAr[i][el])
            info[num] += txt[n] + ': '+ dataAr[i][el] + '\n'
        }
        
    }
}


async function fd(url, res, txt, num) {
    var response = await fetch(url);
    var data = await response.json(); 
    var dataAr = data.data;
    var re = res.split(',');
    var txt = txt.split(',')
    for (let i = 0; i < dataAr.length; i++) {
        info[num] += '\n\n'
        for (let n = 0; n < re.length; n++) {
            const el = re[n];
            //return '[' + (parseInt(i)+1) + '] ' + txt[n].brightRed + ': '+ dataAr[i][el]
            console.log('[' + (parseInt(i)+1) + '] ' + txt[n].brightRed + ': '+ dataAr[i][el])
            info[num] += '[' + (parseInt(i)+1) + '] ' + txt[n] + ': '+ dataAr[i][el] + '\n';
        }
        console.log()
    }
    
}


async function fb(url, res, txt, num) {
    var response = await fetch(url);
    var data = await response.json(); 
    var dataAr = data;
    var re = res.split(',');
    var txt = txt.split(',')
    for (let i = 0; i < dataAr.length; i++) {
        info[num] += '\n\n'
        for (let n = 0; n < re.length; n++) {
            const el = re[n];
            console.log(txt[n].brightRed + ': '+ dataAr[i][el])
            info[num] += txt[n] + ': '+ dataAr[i][el] + '\n'
            
        }
        
        
    }
    
}

async function fgroup(url, num) {
    var response = await fetch(url);
    var data = await response.json(); 

    var dataAr = data.data;
    info[num] += '\n\n'
    dataAr.forEach(ar => {
        console.log(ar)
        info[num] += JSON.stringify(ar) + '\n';
    });
}


async function c(url, text, num) {
    var response = await fetch(url);
    var data = await response.json(); 
    console.log(text.brightRed + data.count)
    info[num] += '\n\n'
    info[num] += text + data.count + '\n'
}


function start() {
    nodeBashTitle('BANVIEW BY SCR1PP3D')
    console.clear();
    console.log(`      
    
██████╗░░█████╗░███╗░░██╗██╗░░░██╗██╗███████╗░██╗░░░░░░░██╗
██╔══██╗██╔══██╗████╗░██║██║░░░██║██║██╔════╝░██║░░██╗░░██║
██████╦╝███████║██╔██╗██║╚██╗░██╔╝██║█████╗░░░╚██╗████╗██╔╝
██╔══██╗██╔══██║██║╚████║░╚████╔╝░██║██╔══╝░░░░████╔═████║░
██████╦╝██║░░██║██║░╚███║░░╚██╔╝░░██║███████╗░░╚██╔╝░╚██╔╝░
╚═════╝░╚═╝░░╚═╝╚═╝░░╚══╝░░░╚═╝░░░╚═╝╚══════╝░░░╚═╝░░░╚═╝░░BANNED USER VIEWER 
    BY SCR1PP3D
    ─────────────────────────────────────────────────`.brightRed)
}


async function getID() {
    start()
    var arg = argv._.toString()
    if (parseInt(arg)) {
        function checkNum() {
            log('You entered a number, is this a URL (u) or an ID (i): ')
            var type = pprompt('');
    
            if (type.toLowerCase() == 'u') {
                getIDFromUsername()
            }
            else if (type.toLowerCase() == 'i') {
                base.id = arg
                checkMethod()
            }
            else {
                checkNum()
            }
        }
        checkNum()
    }
    else if (typeof arg == 'string' && !arg.includes('=')) {
        getIDFromUsername()
    }
    else {
        process.exit(1)
    }

    async function getIDFromUsername() {
        var url = 'https://api.roblox.com/users/get-by-username?username='+arg;
        var response = await fetch(url);
        var data = await response.json();
    
        var id = data.Id;

        base.id = id
    
        if (JSON.stringify(data).includes('Something went wrong')) {
            return showErr()
        }
        checkMethod()
    }
}


async function checkMethod() {
    start()
    log('ID: '+ base.id)

    console.log(`
    [1] Basic User Info (Display Name, Join Date)
    [2] Favorite Games
    [3] Game Badges
    [4] Roblox Badges
    [5] Groups they were in
    [6] Friends
    [7] Friends, Followings and Followers Count
    [8] Roblox avatar (face only)
    [9] Save all to .txt file
    [10] Display everything about the user
    [11] Exit
    `)

    


    var opt = pprompt('')
    if (opt=='1') {
        console.clear();
        await f('https://users.roblox.com/v1/users/'+ base.id, 'displayName,description,created', 'Display Name,About Me,Join Date', 1)
        pprompt('Press any key to continue')
        checkMethod()
    }
    else if (opt=='2') {
        console.clear();
        await fd('https://games.roblox.com/v2/users/'+ base.id + '/favorite/games?sortOrder=Asc&limit=10', 'id,name', 'Game ID,Game Name', 2)
        pprompt('Press any key to continue')
        checkMethod()
    }
    else if (opt=='3') {
        console.clear();
        await fd('https://badges.roblox.com/v1/users/'+base.id+'/badges?limit=10&sortOrder=Asc', 'id,name,description', 'Badge ID,Badge Name,Badge Description',3)
        pprompt('Press any key to continue')
        checkMethod()
    }
    else if (opt=='4') {
        console.clear();
        await fb('https://accountinformation.roblox.com/v1/users/'+base.id+'/roblox-badges', 'name,description', 'Badge Name,Badge Description',4)
    
        pprompt('Press any key to continue')
        checkMethod()
    }
    else if (opt=='5') {
        console.clear();
        await fgroup('https://groups.roblox.com/v2/users/'+base.id+'/groups/roles',5)
        pprompt('Press any key to continue')
        checkMethod()
    }
    else if (opt=='6') {
        console.clear();
        await fd('https://friends.roblox.com/v1/users/'+base.id+'/friends?limit=10', 'id,isOnline,name,displayName', 'User ID,Is Online,Name,Display Name',6)
    
        pprompt('Press any key to continue')
        checkMethod()
    }
    else if (opt=='7') {
        console.clear();
        await c('https://friends.roblox.com/v1/users/'+base.id+'/friends/count', 'Friends: ',7)
    await c('https://friends.roblox.com/v1/users/'+base.id+'/followers/count', 'Followers: ',7)
    await c('https://friends.roblox.com/v1/users/'+base.id+'/followings/count', 'Following: ',7)
    
        pprompt('Press any key to continue')
        checkMethod()
    }
    else if (opt=='8') {
        console.clear();
        await fd('https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds='+base.id+'&size=150x150&format=Png&isCircular=false', 'imageUrl', 'Headshot',8)
    
        pprompt('Press any key to continue')
        checkMethod()
    }
    else if (opt=='9') {
        console.clear();
        
        var url = 'https://users.roblox.com/v1/users/'+ base.id;
        var response = await fetch(url);
        var data = await response.json(); 

        var p = data.name
        
        fs.mkdirSync(p, { recursive: true })

        

        await f('https://users.roblox.com/v1/users/'+ base.id, 'displayName,description,created', 'Display Name,About Me,Join Date', 1)
        await fd('https://games.roblox.com/v2/users/'+ base.id + '/favorite/games?sortOrder=Asc&limit=10', 'id,name', 'Game ID,Game Name', 2)
        await fd('https://badges.roblox.com/v1/users/'+base.id+'/badges?limit=10&sortOrder=Asc', 'id,name,description', 'Badge ID,Badge Name,Badge Description',3)
        await fb('https://accountinformation.roblox.com/v1/users/'+base.id+'/roblox-badges', 'name,description', 'Badge Name,Badge Description',4)
        await fgroup('https://groups.roblox.com/v2/users/'+base.id+'/groups/roles',5)
        await fd('https://friends.roblox.com/v1/users/'+base.id+'/friends?limit=10', 'id,isOnline,name,displayName', 'User ID,Is Online,Name,Display Name',6)
        await fd('https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds='+base.id+'&size=150x150&format=Png&isCircular=false', 'imageUrl', 'Headshot',8)
        await c('https://friends.roblox.com/v1/users/'+base.id+'/friends/count', 'Friends: ',7)
        await c('https://friends.roblox.com/v1/users/'+base.id+'/followers/count', 'Followers: ',7)
        await c('https://friends.roblox.com/v1/users/'+base.id+'/followings/count', 'Following: ',7)

        console.clear();

        fs.writeFile(p+'/Basic_User_Info.txt', info[1], function (err) {
            if (err) console.log(err);
            
        });
        fs.writeFile(p+'/Favorite_Games.txt',info[2], function (err) {
            if (err) throw err;
            
        });
        fs.writeFile(p+'/Game_Badges.txt',info[3], function (err) {
            if (err) throw err;
            
        });
        fs.writeFile(p+'/Roblox_Badges.txt',info[4], function (err) {
            if (err) throw err;
            
        });
        fs.writeFile(p+'/Groups.txt',info[5], function (err) {
            if (err) throw err;
            
        });
        fs.writeFile(p+'/Friends.txt',info[6], function (err) {
            if (err) throw err;
            
        });
        fs.writeFile(p+'/Friends_Following_Followers_Count.txt',info[7], function (err) {
            if (err) throw err;
            
        });

        console.clear();
        console.log('DONE!')
    }
    else if (opt=='10') {
        getInfo()
    }
    else if (opt=='11') {
        process.exit()
    }
    else {
        checkMethod()
    }
}

async function getInfo() {
    
    var urls = {
        1: 'https://users.roblox.com/v1/users/'+ base.id,
        2: 'https://games.roblox.com/v2/users/'+ base.id + '/favorite/games?sortOrder=Asc&limit=10',
        3: 'https://badges.roblox.com/v1/users/'+base.id+'/badges?limit=10&sortOrder=Asc',
        4: 'https://accountinformation.roblox.com/v1/users/'+base.id+'/roblox-badges',
        5: 'https://games.roblox.com/v2/users/'+base.id+'/games?sortOrder=Asc&limit=10',
        6: 'https://groups.roblox.com/v2/users/'+base.id+'/groups/roles',
        7: 'https://friends.roblox.com/v1/users/'+base.id+'/friends?limit=10',
        8: 'https://friends.roblox.com/v1/users/'+base.id+'/friends/count',
        9: 'https://friends.roblox.com/v1/users/'+base.id+'/followings/count',
        10: 'https://friends.roblox.com/v1/users/'+base.id+'/followers/count',
        11: 'https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds='+base.id+'&size=48x48&format=Png&isCircular=false'
    }
    


    console.log()
    console.log()
    console.log('USER INFO:'.brightWhite)
    await f('https://users.roblox.com/v1/users/'+ base.id, 'displayName,description,created', 'Display Name,About Me,Join Date', 1)
    console.log()
    console.log('FAVORITE GAMES:'.brightWhite)
    await fd('https://games.roblox.com/v2/users/'+ base.id + '/favorite/games?sortOrder=Asc&limit=10', 'id,name', 'Game ID,Game Name', 2)
    console.log()
    console.log('BADGES:'.brightWhite)
    await fd('https://badges.roblox.com/v1/users/'+base.id+'/badges?limit=10&sortOrder=Asc', 'id,name,description', 'Badge ID,Badge Name,Badge Description',3)
    console.log()
    console.log('ROBLOX BADGES')
    await fb('https://accountinformation.roblox.com/v1/users/'+base.id+'/roblox-badges', 'name,description', 'Badge Name,Badge Description',4)
    console.log()
    console.log('GROUP ROLES')
    await fgroup('https://groups.roblox.com/v2/users/'+base.id+'/groups/roles',5)
    console.log()
    console.log('FRIENDS')
    await fd('https://friends.roblox.com/v1/users/'+base.id+'/friends?limit=200', 'id,isOnline,name,displayName', 'User ID,Is Online,Name,Display Name',6)
    console.log()
    console.log('FRIENDS/FOLLOWERS/FOLLOWINGS COUNT')
    await c('https://friends.roblox.com/v1/users/'+base.id+'/friends/count', 'Friends: ',7)
    await c('https://friends.roblox.com/v1/users/'+base.id+'/followers/count', 'Followers: ',7)
    await c('https://friends.roblox.com/v1/users/'+base.id+'/followings/count', 'Following: ',7)
    console.log()
    console.log('ROBLOX AVATAR')
    await fd('https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds='+base.id+'&size=150x150&format=Png&isCircular=false', 'imageUrl', 'Headshot',8)
    /* group icons
    'https://thumbnails.roblox.com/v1/groups/icons?groupIds='12325228'&size=150x150&format=Png&isCircular=false'
    */
    pprompt('Press any key to continue')
    checkMethod()

}

getID()