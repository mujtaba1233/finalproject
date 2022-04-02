import React from "react";
import QuoteForm from "../../components/quotes/create/quote-form";
import Header from "../../components/shared/header/header";

export default class QuoteFormContainer extends React.Component {
    constructor(props) {
        super(props);
        // this.handleChange = this.handleChange.bind(this);
    }
    render() {
        return (
            <div>
                <Header></Header>
                <div className="main-content">
                    <QuoteForm {...this.props} />
                </div>
            </div>
        )
    }
}
