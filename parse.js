export function parsePlayerLookup(text) {
    console.log(text);
    const a = text.split('<tbody')[1].split('<td class=\"list-column\">');
    const players = [];
    for (let i = 1; i < a.length; i += 6) {
        players.push({
            index: parsePlayerLookupIndex(a[i]),
            id: parsePlayerLookupId(a[i+1]),
            name: parsePlayerLookupName(a[i+1]) + " " + parsePlayerLookupName(a[i+2]),
            usatt: parsePlayerLookupUsatt(a[i+3]),
            location: parsePlayerLookupLocation(a[i+4]),
            clubId: parsePlayerLookupClubId(a[i+5]),
            club: parsePlayerLookupClub(a[i+5]),
            rating: parsePlayerLookupRating(a[i+5])
        });
    };
    return players;
};

function parsePlayerLookupIndex(text) {
    return Number(text.split('</td>')[0]);
};

function parsePlayerLookupId(text) {
    return Number(text.split('<a href="/userAccount/up/')[1].split(`">`)[0]);
};

function parsePlayerLookupName(text) {
    return text.split('">')[1].split('</a></td>')[0]
};

function parsePlayerLookupUsatt(text) {
    return Number(text.split('</td>')[0]);
};

function parsePlayerLookupLocation(text) {
    return text.split('</td>')[0] || null;
};

function parsePlayerLookupClubId(text) {
    return Number(text.split('<a href="/c/p')[1].split('">')[0].slice(1)) || null;
};

function parsePlayerLookupClub(text) {
    return text.split('">')[1].split('</a></td>')[0] || null;
};

function parsePlayerLookupRating(text) {
    return Number(text.split('">')[2].split('</td>')[0]);
};

export function parsePlayerInfo(text) {
    console.log(text);
    const { currRating, highestRating, numberOfTournaments } = parsePlayerInfoCurrentRatingHighestRatingAndNumberOfTournaments(text);
    return {
        name: parsePlayerInfoName(text),
        img: parsePlayerInfoImg(text),
        id: parsePlayerInfoPlayerId(text),
        usatt: parsePlayerInfoUsatt(text),
        lastTournament: parsePlayerInfoLastTournamentPlayed(text),
        prevRating: parsePlayerInfoPreviousRating(text),
        currRating,
        highestRating,
        numberOfTournaments
    };
};

function parsePlayerInfoName(text) {
    return text.split('col-sm-7')[1].split('<span class=\"title less-margin\">')[1].split('</span>')[0];
};

function parsePlayerInfoImg(text) {
    return text.split('img class=\"backup_picture\" src=\"')[1].split('.jpg')[0] + ".jpg";
};

function parsePlayerInfoCurrentRatingHighestRatingAndNumberOfTournaments(text) {
    const split = text.split('<span class=\"details-text\">');
    return {
        currRating: Number(split[1].split('</span>')[0]),
        highestRating: Number(split[2].split('</span>')[0]),
        numberOfTournaments: Number(split[3].split('</span>')[0])
    };
};

function parsePlayerInfoPlayerId(text) {
    return Number(text.split('/userAccount/follow/')[1].split('\">')[0]);
};

function parsePlayerInfoUsatt(text) {
    return Number(text.split('USATT#: ')[1].split('\n')[0]);
};

function parsePlayerInfoLastTournamentPlayed(text) {
    return text.split('<td class=\"list-column\">')[1].split('</a></td>')[0].split('">')[1];
};

function parsePlayerInfoPreviousRating(text) {
    return Number(text.split('<td class=\"list-column\">')[1].split('<td class=\"list-column mobile-hide text-center\">\n')[1].split('\n')[0].trim());
};