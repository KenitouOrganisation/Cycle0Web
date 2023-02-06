class RenderLicenses{

    static renderLicenses(licenseName){
        console.log('license', licenseName)

        const targetLicenseDetails = fetcher.licensesGithubDetails
                                        .filter((license) => license.key.toLowerCase() == licenseName.toLowerCase());

        return (
            <div class="license-article-item">
                {
                    targetLicenseDetails && targetLicenseDetails.length > 0 
                        ? targetLicenseDetails[0].description
                        : 'No description available'
                }
            </div>
        )
    }

    static renderPackageList(pkgs){
        console.log('pkg', pkgs)

        const pkgContainer = (
            <ul></ul>
        )

        pkgs.forEach((pkgName) => {

            pkgContainer.appendChild(
                <li class="license-pkg-item">
                    <p class="license-pkg-name">{pkgName}</p>
                </li>
            )
        })

        return pkgContainer;
    }

    static renderAll(fetcher){

        let container = (
            <div></div>
        );

        document.body.appendChild(container);
        
        for(const licenseName in fetcher.licenses){
            const pkgs = fetcher.licenses[licenseName];
            const licenseContainer = (
                <div class="license-container">
                    <div class="license-name">{licenseName}</div>

                    <div class="license-pkg-list">
                        {this.renderPackageList(pkgs)}
                    </div>

                    <div class="license-article">
                        {this.renderLicenses(licenseName)}
                    </div>
                </div>
            );

            container.appendChild(licenseContainer);
        }

    }

}