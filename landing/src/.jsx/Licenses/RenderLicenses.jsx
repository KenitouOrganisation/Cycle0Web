class RenderLicenses{

    static renderLicenses(licenseName){
        const targetLicenseDetails = fetcher.licensesGithubDetails
                                        .filter((license) => license.key.toLowerCase() == licenseName.toLowerCase());

        const details = targetLicenseDetails[0];
        /*const linkLicenses = (
            <a target='_blank'>See license website</a>
        );
        
        if(details?.html_url)
            linkLicenses.href = details?.html_url;*/

        return (
            <div class="license-article-item">
                <p>
                    { details?.description ? details.description : 'No description available' }
                </p>
                <p>
                    { details?.body ? details.body : 'No mentions available' }
                </p>
                <p>
                    {details?.html_url ? details.html_url : ''}
                </p>
            </div>
        )
    }

    static renderPackageList(pkgs){
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