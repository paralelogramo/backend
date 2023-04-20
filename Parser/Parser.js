import antlr4 from 'antlr4';
import ExprLexer from './ExprLexer.js';
import ExprParser from './ExprParser.js';
import ExprListener from './ExprListener.js';
import ExprErrorListener from './ExprErrorListener.js';
import { getBigQuery, getError, setError } from './catchElements.js';
import getQuery from './enumQueries.js';

export default function Parser(pattern) {
    setError({});
    const input = pattern;
    const chars = new antlr4.InputStream(input);
    const lexer = new ExprLexer(chars); // <== here is the problem
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new ExprParser(tokens);
    
    lexer.removeErrorListeners();
    parser.removeErrorListeners();
    parser.addErrorListener(new ExprErrorListener());
    parser.removeParseListeners();
    parser.addParseListener(new ExprListener());
    parser.buildParseTrees = true;

    const tree = parser.pattern();

    // class Visitor {
    // visitChildren(ctx) {
    //     if (!ctx) {
    //     return;
    //     }

    //     if (ctx.children) {
    //     return ctx.children.map(child => {
    //         if (child.children && child.children.length != 0) {
    //         return child.accept(this);
    //         } else {
    //         return child.getText();
    //         }
    //     });
    //     }
    // }
    // }

    // tree.accept(new Visitor());

    if (isEmpty(getError())) {
        return {
            message: 'success',
            query: getBigQuery()
        }
    }
    else {
        return getError();
    }
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}