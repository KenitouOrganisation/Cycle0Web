/*
mettre un objet ou class, et séparer coup de coeur et normal
*/

class ChantiersListArticle {
    constructor(data, container) {
        this.data = data;
        this.container = container;
    }

    // Duplicate from "PresseListRender.jsx"
    convertToFrenchDate(dateString) {
        try {
            const options = { day: "numeric", month: "long", year: "numeric" };
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                throw new Error("Date invalide");
            }
            const frenchDate = date.toLocaleDateString("fr-FR", options);
            return frenchDate;
        } catch (error) {
            console.error("Erreur lors de la conversion de la date :", error);
            return dateString; // Retourner la chaîne de caractères initiale en cas d'erreur
        }
    }

    formatNumber(val) {
        return parseFloat(val).toLocaleString();
    }

    /**
     * 
     * @param {Object|JSON} data
     * @param {String} data.picto
     * @param {String|Number} data.value
     * @param {String|Number} data.extendValue
     * @param {String} data.unit
     * @returns
     */
    renderCell(data) {
        

        // TODO : fix the value shown when above 99 999 millions
        const isMillion = parseFloat(data.value) > 999999;

        const value = isMillion
            ? this.formatNumber(
                    parseInt(parseFloat(data.value)/1000000)
                ) + ' <span style="font-size: 13px;">millions</span>'
            : this.formatNumber( data.value );

        return (
            <div class="cell">
                <div class="illustration">
                    <img src={data.picto} alt="" />
                </div>
                <div class="data">
                    <h2 class="h2">{value}{data.extendValue}</h2>
                    <p class="p2">{data.unit}</p>
                </div>
            </div>
        )
    }

    renderItem(item) {
        return (
            <div class="search-content-box">
                <div class="header">
                    {item.logo && <img src={item.logo} alt={item.title} class="logo" />}
                    <div>
                        <h2 class="h2 _txt_orange">
                            {
                                item.data?.WORKSITE_QUANTITY > 1
                                    ? item.data?.WORKSITE_QUANTITY + ' chantiers'
                                    : '1 chantier'
                            }
                        </h2>
                        <p class="_txt_orange" style="font-size: 18px;" >
                            {item.datetime && this.convertToFrenchDate(item.datetime)}
                        </p>
                    </div>
                </div>
                <div class="content">
                    <div class="table left-box">
                        <div class="cell p1">
                            Résultats : 
                        </div>

                        {this.renderCell({
                            picto: './src/img/icons/Picto_Chantiers_01.png',
                            value: item.data?.WEIGHT,
                            unit: 'Tonnes de déchets'
                        })}

                        {this.renderCell({
                            picto: './src/img/icons/Picto_Chantiers_03.png',
                            value: item.data?.CO2,
                            unit: 'Kg de CO2 économisés'
                        })}
                    </div>
                    <div class="table right-box">
                        <div class="cell p1">
                            L'équivalent de : 
                        </div>

                        {this.renderCell({
                            picto: './src/img/icons/Picto_Chantiers_04.png',
                            value: item.data?.GARBAGE,
                            unit: "Kilos d'ordures"
                        })}

                        {this.renderCell({
                            picto: './src/img/icons/Picto_Chantiers_02.png',
                            value: item.data?.WATER,
                            unit: "Litres d'eau potable"
                        })}

                    </div>
                </div>
            </div>
        );
    }

    renderContent() {
        const contentContainer = <div class="container"></div>;

        this.data.forEach((item) => {
            contentContainer.appendChild(this.renderItem(item));
        });

        return contentContainer;
    }

    render() {
        this.container.replaceChildren(this.renderContent());
    }
}
