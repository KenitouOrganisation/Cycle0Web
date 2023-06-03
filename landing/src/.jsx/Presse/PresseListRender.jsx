/*
mettre un objet ou class, et séparer coup de coeur et normal
*/

class PresseListArticle {
    constructor(data, container) {
        this.data = data;
        this.container = container;
    }

    sortByDate(desc = false) {
        this.data.sort((a, b) => {
            const datetimeA = new Date(a.datetime);
            const datetimeB = new Date(b.datetime);
            if (desc) return datetimeB - datetimeA;
            return datetimeA - datetimeB;
        });
    }

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

    renderItem(item) {
        return (
            <div class="article-box">
                <a target="_blank" href={item.link}>
                    <h2>{item.title}</h2>
                    <p class="datetime">
                        {this.convertToFrenchDate(item.datetime)}
                    </p>
                    <p>
                        {item.type}
                        <span class="_dot">. </span>
                        {item.description}
                    </p>
                    {item.image && <img src={item.image} alt={item.title} />}
                    <p class="authors">{item.authors}</p>
                    <p class="seemore">
                        Voir plus<span>&rarr;</span>
                    </p>
                </a>
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
