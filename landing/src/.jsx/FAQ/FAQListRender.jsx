class FAQListArticle {
	constructor(data, container) {
		this.data = data;
		this.container = container;
	}

	// item : question, answer
	renderItem(item) {
		// converting \n to <br>
		item.answer = item.answer.replace(/\n/g, "<br>");

		const box = (
			<div class="article-box">
				<div class="header">
					<h2>{item.question}</h2>
					<div class="arrow"></div>
				</div>
				<p class="answer">{item.answer}</p>
			</div>
		);

		box.addEventListener("click", (e) => {
			if (
				!e.target.classList.contains("answer") &&
				!e.target.parentNode?.classList.contains("answer")
			)
				box.classList.toggle("on");
		});

		return box;
	}

	renderList() {
		const ctn = (
			<div class="article-list">{this.data.map(this.renderItem)}</div>
		);

		this.container.appendChild(ctn);
	}
}
