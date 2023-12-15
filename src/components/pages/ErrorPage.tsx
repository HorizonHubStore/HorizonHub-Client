import {useRouteError} from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div id='error-page'>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>{error instanceof Error && <i>{error.message}</i>}</p>
            <p>{error instanceof Response && <i>{error.statusText}</i>}</p>
        </div>
    );
};

export default ErrorPage;