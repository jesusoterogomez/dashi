import React from 'react';
import { RouteComponentProps } from "@reach/router";
import googleCalendar from 'integrations/googleCalendar';
import qs from 'query-string';

type Props = RouteComponentProps & {};

const getCode = (query = '') => {
    const params = qs.parse(query);
    return params.code || false;
};

export default class OAuth extends React.Component<Props> {
    componentDidMount () {
        const code = getCode(this.props.location?.search);

        if (code) {
            this.handleCode(code as string);
        }
    }

    handleCode = async (code: string) => {
        await googleCalendar.setup(code);

        if (this.props.navigate) {
            return this.props.navigate('profile');
        }

    }

    render() {
        return (
            <div>
                callback!
            </div>
        )
    };
}
