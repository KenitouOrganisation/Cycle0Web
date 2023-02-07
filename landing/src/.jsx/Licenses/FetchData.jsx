class FetchData{

    constructor(){
        this.licenses = [];
        this.licensesGithub = [];
        this.licensesGithubDetails = [];

        this.loaded = false;
    }

    async Init(){
        // fetching our package dependencies licenses list
        this.licenses = await this.getLicenses();
        console.clear();
        // fetching github licenses list (the 12 most popular licenses)
        this.licensesGithub = await this.getGithubLicensesList();
        console.clear();
        // fetching github licenses details for each license provide by github without API key
        for(let i = 0; i < this.licensesGithub.length; i++){
            this.licensesGithubDetails.push(
                await this.getGithubLicensesDetails(this.licensesGithub[i].key)
            );
            console.clear();
        }

        this.loaded = true;
        console.log(this.loaded)

    }

    getLicenses(){
        return fetch('./src/page/licenses.data.json')
            .then(response => response.json())
            .then(data => data);
    }

    getGithubLicensesList(){
        return fetch('https://api.github.com/licenses')
            .then(response => response.json())
            .then(data => data);
    }

    getGithubLicensesDetails(license){
        return fetch(`https://api.github.com/licenses/${license}`)
            .then(response => response.json())
            .then(data => data);
    }

    onReady(){
        return new Promise((resolve, reject) => {
            if(this.loaded && globalThis.fromMobile === 3){
                resolve();
            } else {
                setTimeout(() => {
                    this.onReady().then(() => {
                        resolve();
                    });
                }, 100);
            }
        });
    }
    
    onReadyMob(){
        return new Promise((resolve, reject) => {
            if(globalThis.fromMobile === 3){
                resolve();
            } else {
                setTimeout(() => {
                    this.onReadyMob().then(() => {
                        resolve();
                    });
                }, 100);
            }
        });
    }

}