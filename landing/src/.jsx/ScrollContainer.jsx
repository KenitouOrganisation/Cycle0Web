class ScrollContainer
{
    construct({ index, title, description, img, currentPage, totalPage })
    {
        this._index = index
        this._title = title
        this._description = description
        this._img = img
        this._currentPage = currentPage
        this._totalPage = totalPage
        
    }

    ScrollMenu(){
        return (
            <div class="scroll_menu">
                <p>Hello</p>s <br />
                <p>OK boss</p>
            </div>
        )
    }
}