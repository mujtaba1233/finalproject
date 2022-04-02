import React from "react";
import QuoteList from "../../components/quotes/search/quote-search";
import Header from "../../components/shared/header/header";

export default class SearchQuoteContainer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <div className="main-content">
                    <Header></Header>
                    <QuoteList history={this.props.history}></QuoteList>
                </div>
            </div>
        )
    }
}
