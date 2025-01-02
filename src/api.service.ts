async function fetchSuggestion(searchText:string):Promise<{
    suggestion: string,
    uuid: string
}[]> {
    try {
        let res = await fetch(`https://dummyjson.com/users/search?q=${searchText}`);
        let resJson = await res.json();
        let list:{
            suggestion: string,
            uuid: string
        }[] = [];
        resJson.users.forEach((item:any) => {
            list.push({
                suggestion: `${item.firstName} ${item.lastName}`,
                uuid: `${item.id}`
            })
        });
        return list;
    } catch (err) {
        console.log(err)
    }
    return []
}

async function fetchSearched(searchId:string):Promise<string> {
    if (searchId.trim() !== "") {
        try {
            let res = await fetch(`https://dummyjson.com/users/${searchId}`);
            let resJson = await res.json();
            let userDetails = `Id: ${resJson.id} Name: ${resJson.firstName} ${resJson.lastName} Email: ${resJson.email} Phone: ${resJson.phone}`;
            return userDetails;
        } catch (err) {
            console.log (err)
        }
        return "Server issue, counldn't fetch user";
    } else {
        return `No such user, please select from the suggested list.`;
    }
}

export {
    fetchSearched,
    fetchSuggestion
}