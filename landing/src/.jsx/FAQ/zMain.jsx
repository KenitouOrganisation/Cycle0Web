Engine.OnReady(()=>{

    // we erase the content of the main div
    document.querySelector("#faq-main").innerHTML = "<div class='content'></div>";

    const articles = new FAQListArticle(FAQListData, document.querySelector("#faq-main .content"));
    globalThis.articles = articles;
    articles.renderList()
    console.clear();

});