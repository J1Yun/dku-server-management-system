import React from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import ResDoc from './ResDoc';

const App = () => (
    <PDFViewer>
        <ResDoc />
    </PDFViewer>
);

ReactDOM.render(<App />, document.getElementById('root'));
