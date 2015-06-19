
function noop() { }
noop['exec'] = noop;

function merge<A, B, C>(a: A, b: B, c: C): A|B|C
function merge(...objs)
function merge(obj) {
    var i = 1, target, key;

    for (; i < arguments.length; i++) {
        target = arguments[i];
        for (key in target) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                obj[key] = target[key];
            }
        }
    }

    return obj;
}



function escape(html, encode?) {
    return html
        .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function unescape(html) {
    return html.replace(/&([#\w]+);/g, function(_, n) {
        n = n.toLowerCase();
        if (n === 'colon') return ':';
        if (n.charAt(0) === '#') {
            return n.charAt(1) === 'x'
                ? String.fromCharCode(parseInt(n.substring(2), 16))
                : String.fromCharCode(+n.substring(1));
        }
        return '';
    });
}


interface IBlock {
    tables: any;
    gfm: any;
    normal: any;
    paragraph: any;
    html: any;
    _tag: string;
    blockquote: any;
    list: any;
    item: any;
    bullet: RegExp;
    text: RegExp;
    table: RegExp;
    def: RegExp;
    lheading: RegExp;
    nptable: RegExp;
    heading: RegExp;
    hr: RegExp;
    fences: RegExp;
    code: RegExp;
    newline: RegExp;

}
var defaultBlock = (() => {
    let rnoop = <RegExp> (<any> noop);

    let b: IBlock = <IBlock> {};

    //todo need to figure out what this does.
    function replace(regex, opt?) {
        regex = regex.source;
        opt = opt || '';
        return function self(name, val): any {
            if (!name) return new RegExp(regex, opt);
            val = val.source || val;
            val = val.replace(/(^|[^\[])\^/g, '$1');
            regex = regex.replace(name, val);
            return self;
        };
    }

    b.newline = /^\n+/;
    b.code = /^( {4}[^\n]+\n*)+/;
    b.fences = rnoop;
    b.hr = /^( *[-*_]){3,} *(?:\n+|$)/;
    b.heading = /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/;
    b.nptable = rnoop;

    b.lheading = /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/;
    var blockquote1 = /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/;
    var list1 = /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/;
    var html1 = /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/;
    b.def = /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/;
    b.table = rnoop;
    var paragraph1 = /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/;
    b.text = /^[^\n]+/;

    b.bullet = /(?:[*+-]|\d+\.)/;

    var item1 = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;

    b.item = replace(item1, 'gm')
        (/bull/g, b.bullet)
        ();

    b.list = replace(list1)
        (/bull/g, b.bullet)
        ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
        ('def', '\\n+(?=' + b.def.source + ')')
        ();

    b.blockquote = replace(blockquote1)
        ('def', b.def)
        ();


    b._tag = '(?!(?:'
    + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
    + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
    + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

    b.html = replace(html1)
        ('comment', /<!--[\s\S]*?-->/)
        ('closed', /<(tag)[\s\S]+?<\/\1>/)
        ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
        (/tag/g, b._tag)
        ();

    b.paragraph = replace(paragraph1)
        ('hr', b.hr)
        ('heading', b.heading)
        ('lheading', b.lheading)
        ('blockquote', b.blockquote)
        ('tag', '<' + b._tag)
        ('def', b.def)
        ();


    b.normal = merge({}, b);

    b.gfm = merge({}, b.normal, {
        fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
        paragraph: /^/,
        heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
    });

    b.gfm.paragraph = replace(b.paragraph)
        ('(?!', '(?!'
            + b.gfm.fences.source.replace('\\1', '\\2') + '|'
            + b.list.source.replace('\\1', '\\3') + '|')
        ();


    b.tables = merge({}, b.gfm, {
        nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
        table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
    });


    return b;
})();

interface ITokens {
    links: any;
    [index: string]: any;
    reverse();
}

interface LexerOptions {
    gfm: boolean;
    tables: boolean;
    breaks: boolean;
    pedantic: boolean;
    sanitize: boolean;
    mangle: boolean;
    smartLists: boolean;
    silent: boolean;
    sanitizer: any;
    highlight: any;
    langPrefix: string;
    smartypants: boolean;
    headerPrefix: string;
    renderer: Renderer;
    xhtml: boolean;
}


class Renderer {
    options: any = {};


    code(code, lang, escaped) {
        if (this.options.highlight) {
            var out = this.options.highlight(code, lang);
            if (out != null && out !== code) {
                escaped = true;
                code = out;
            }
        }

        if (!lang) {
            return `<pre><code>${(escaped ? code : escape(code, true))}\n</code></pre>`;
        }

        return `<pre><code class="${this.options.langPrefix}${escape(lang, true)}">${(escaped ? code : escape(code, true))}\n</code></pre>\n`;
    }

    blockquote(quote) {
        return `<blockquote>\n${quote}</blockquote>\n`;
    }

    html(html) {
        return html;
    }

    heading(text, level, raw) {
        return `<h${level} id="${this.options.headerPrefix}${raw.toLowerCase().replace(/[^\w]+/g, '-') }">${text}</h${level}>\n`;
    }

    hr() {
        return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
    }

    list(body, ordered) {
        var type = ordered ? 'ol' : 'ul';
        return `<${type}>\n${body}</${type}>\n`;
    }

    listitem(text) {
        return `<li>${text}</li>\n`;
    }

    paragraph(text) {
        return `<p>${text}</p>\n`;
    }

    table(header, body) {
        return `<table>\n<thead>\n${header}</thead>\n<tbody>\n${body}</tbody>\n</table>\n`;
    }

    tablerow(content) {
        return `<tr>\n${content}</tr>\n`;
    }

    tablecell(content, flags) {
        var type = flags.header ? 'th' : 'td';
        var tag = flags.align
            ? `<${type} style="text-align:${flags.align}">`
            : `<${type}>`;
        return `${tag}${content}</${type}>\n`;
    }

    // span level renderer
    strong(text) {
        return `<strong>${text}</strong>`;
    }

    em(text) {
        return `<em>${text}</em>`;
    }

    codespan(text) {
        return `<code>${text}</code>`;
    }

    br() {
        return this.options.xhtml ? '<br/>' : '<br>';
    }

    del(text) {
        return `<del>${text}</del>`;
    }

    link(href, title, text) {
        if (this.options.sanitize) {
            try {
                var prot = decodeURIComponent(unescape(href))
                    .replace(/[^\w:]/g, '')
                    .toLowerCase();
            } catch (e) {
                return '';
            }
            if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
                return '';
            }
        }
        var out = `<a href="${href}"`;
        if (title) {
            out += ` title="${title}"`;
        }
        out += `>${text}</a>`;
        return out;
    }

    image(href, title, text) {
        var out = `<img src="${href}" alt="${text}"`;
        if (title) {
            out += ` title="${title}"`;
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
    }

    text(text) {
        return text;
    }
}

interface ILexResult {
    tokens: any[];
    tokenLinks: any;
}
class Lexer {
    tokens: any[] = [];
    tokenLinks: any = {};

    options: LexerOptions;
    get rules(): IBlock {
        return defaultBlock;
    }


    constructor(options?) {
        this.options = options || Lexer.defaultOptions;
    }

    lex(src): ILexResult {
        src = src
            .replace(/\r\n|\r/g, '\n')
            .replace(/\t/g, '    ')
            .replace(/\u00a0/g, ' ')
            .replace(/\u2424/g, '\n');

        return this.token(src, true);
    };

    token(src, top, bq?): ILexResult {
        var src = src.replace(/^ +$/gm, '')
            , next
            , loose
            , cap
            , bull
            , b
            , item
            , space
            , i
            , l;

        while (src) {
            // newline
            if (cap = this.rules.newline.exec(src)) {
                src = src.substring(cap[0].length);
                if (cap[0].length > 1) {
                    this.tokens.push({
                        type: 'space'
                    });
                }
            }

            // code
            if (cap = this.rules.code.exec(src)) {
                src = src.substring(cap[0].length);
                cap = cap[0].replace(/^ {4}/gm, '');
                this.tokens.push({
                    type: 'code',
                    text: !this.options.pedantic
                        ? cap.replace(/\n+$/, '')
                        : cap
                });
                continue;
            }

            // fences (gfm)
            if (cap = this.rules.fences['exec'](src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'code',
                    lang: cap[2],
                    text: cap[3]
                });
                continue;
            }

            // heading
            if (cap = this.rules.heading.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'heading',
                    depth: cap[1].length,
                    text: cap[2]
                });
                continue;
            }

            // table no leading pipe (gfm)
            if (top && (cap = this.rules.nptable['exec'](src))) {
                src = src.substring(cap[0].length);

                item = {
                    type: 'table',
                    header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                    align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                    cells: cap[3].replace(/\n$/, '').split('\n')
                };

                for (i = 0; i < item.align.length; i++) {
                    if (/^ *-+: *$/.test(item.align[i])) {
                        item.align[i] = 'right';
                    } else if (/^ *:-+: *$/.test(item.align[i])) {
                        item.align[i] = 'center';
                    } else if (/^ *:-+ *$/.test(item.align[i])) {
                        item.align[i] = 'left';
                    } else {
                        item.align[i] = null;
                    }
                }

                for (i = 0; i < item.cells.length; i++) {
                    item.cells[i] = item.cells[i].split(/ *\| */);
                }

                this.tokens.push(item);

                continue;
            }

            // lheading
            if (cap = this.rules.lheading.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'heading',
                    depth: cap[2] === '=' ? 1 : 2,
                    text: cap[1]
                });
                continue;
            }

            // hr
            if (cap = this.rules.hr.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'hr'
                });
                continue;
            }

            // blockquote
            if (cap = this.rules.blockquote.exec(src)) {
                src = src.substring(cap[0].length);

                this.tokens.push({
                    type: 'blockquote_start'
                });

                cap = cap[0].replace(/^ *> ?/gm, '');

                // Pass `top` to keep the current
                // "toplevel" state. This is exactly
                // how markdown.pl works.
                this.token(cap, top, true);

                this.tokens.push({
                    type: 'blockquote_end'
                });

                continue;
            }

            // list
            if (cap = this.rules.list.exec(src)) {
                src = src.substring(cap[0].length);
                bull = cap[2];

                this.tokens.push({
                    type: 'list_start',
                    ordered: bull.length > 1
                });

                // Get each top-level item.
                cap = cap[0].match(this.rules.item);

                next = false;
                l = cap.length;
                i = 0;

                for (; i < l; i++) {
                    item = cap[i];

                    // Remove the list item's bullet
                    // so it is seen as the next token.
                    space = item.length;
                    item = item.replace(/^ *([*+-]|\d+\.) +/, '');

                    // Outdent whatever the
                    // list item contains. Hacky.
                    if (~item.indexOf('\n ')) {
                        space -= item.length;
                        item = !this.options.pedantic
                            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
                            : item.replace(/^ {1,4}/gm, '');
                    }

                    // Determine whether the next list item belongs here.
                    // Backpedal if it does not belong in this list.
                    if (this.options.smartLists && i !== l - 1) {
                        b = defaultBlock.bullet.exec(cap[i + 1])[0];
                        if (bull !== b && !(bull.length > 1 && b.length > 1)) {
                            src = cap.slice(i + 1).join('\n') + src;
                            i = l - 1;
                        }
                    }

                    // Determine whether item is loose or not.
                    // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
                    // for discount behavior.
                    loose = next || /\n\n(?!\s*$)/.test(item);
                    if (i !== l - 1) {
                        next = item.charAt(item.length - 1) === '\n';
                        if (!loose) loose = next;
                    }

                    this.tokens.push({
                        type: loose
                            ? 'loose_item_start'
                            : 'list_item_start'
                    });

                    // Recurse.
                    this.token(item, false, bq);

                    this.tokens.push({
                        type: 'list_item_end'
                    });
                }

                this.tokens.push({
                    type: 'list_end'
                });

                continue;
            }

            // html
            if (cap = this.rules.html.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: this.options.sanitize
                        ? 'paragraph'
                        : 'html',
                    pre: !this.options.sanitizer
                    && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
                    text: cap[0]
                });
                continue;
            }

            // def
            if ((!bq && top) && (cap = this.rules.def.exec(src))) {
                src = src.substring(cap[0].length);
                this.tokenLinks[cap[1].toLowerCase()] = {
                    href: cap[2],
                    title: cap[3]
                };
                continue;
            }

            // table (gfm)
            if (top && (cap = this.rules.table['exec'](src))) {
                src = src.substring(cap[0].length);

                item = {
                    type: 'table',
                    header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                    align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                    cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
                };

                for (i = 0; i < item.align.length; i++) {
                    if (/^ *-+: *$/.test(item.align[i])) {
                        item.align[i] = 'right';
                    } else if (/^ *:-+: *$/.test(item.align[i])) {
                        item.align[i] = 'center';
                    } else if (/^ *:-+ *$/.test(item.align[i])) {
                        item.align[i] = 'left';
                    } else {
                        item.align[i] = null;
                    }
                }

                for (i = 0; i < item.cells.length; i++) {
                    item.cells[i] = item.cells[i]
                        .replace(/^ *\| *| *\| *$/g, '')
                        .split(/ *\| */);
                }

                this.tokens.push(item);

                continue;
            }

            // top-level paragraph
            if (top && (cap = this.rules.paragraph.exec(src))) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'paragraph',
                    text: cap[1].charAt(cap[1].length - 1) === '\n'
                        ? cap[1].slice(0, -1)
                        : cap[1]
                });
                continue;
            }

            // text
            if (cap = this.rules.text.exec(src)) {
                // Top-level should never reach here.
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'text',
                    text: cap[0]
                });
                continue;
            }

            if (src) {
                throw new
                    Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }
        }

        return { tokens: this.tokens, tokenLinks: this.tokenLinks };
    }



    static defaultOptions = <LexerOptions> {
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        sanitizer: null,
        mangle: true,
        smartLists: false,
        silent: false,
        highlight: null,
        langPrefix: 'lang-',
        smartypants: false,
        headerPrefix: '',
        renderer: new Renderer(),
        xhtml: false
    };
    static lex(src, options?): ILexResult {
        var lexer = new Lexer(options);
        return lexer.lex(src);
    }
}

interface IInlineRules {
    breaks: any;
    gfm: any;
    pedantic: any;
    normal: any;
    _href: RegExp;
    _inside: RegExp;
    escape: RegExp;
    autolink;
    url: RegExp;
    tag: RegExp;
    link: RegExp;
    reflink: RegExp;
    nolink: RegExp;
    strong: RegExp;
    em: RegExp;
    code: RegExp;
    br: RegExp;
    del: RegExp;
    text: RegExp;
}

var defaultInlineRules = (() => {
    let rnoop = <RegExp> (<any> noop);


    function replace(regex, opt?) {
        regex = regex.source;
        opt = opt || '';
        return function self(name, val): any {
            if (!name) return new RegExp(regex, opt);
            val = val.source || val;
            val = val.replace(/(^|[^\[])\^/g, '$1');
            regex = regex.replace(name, val);
            return self;
        };
    }

    var r: IInlineRules = <IInlineRules>{
        escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
        autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
        url: rnoop,
        tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
        link: /^!?\[(inside)\]\(href\)/,
        reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
        nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
        strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
        em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
        code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
        br: /^ {2,}\n(?!\s*$)/,
        del: rnoop,
        text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
    };

    r._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
    r._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

    r.link = replace(r.link)
        ('inside', r._inside)
        ('href', r._href)
        ();

    r.reflink = replace(r.reflink)
        ('inside', r._inside)
        ();

    /**
     * Normal Inline Grammar
     */

    r.normal = merge({}, r);

    /**
     * Pedantic Inline Grammar
     */

    r.pedantic = merge({}, r.normal, {
        strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
    });

    /**
     * GFM Inline Grammar
     */

    r.gfm = merge({}, r.normal, {
        escape: replace(r.escape)('])', '~|])')(),
        url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
        del: /^~~(?=\S)([\s\S]*?\S)~~/,
        text: replace(r.text)
            (']|', '~]|')
            ('|', '|https?://|')
            ()
    });

    /**
     * GFM + Line Breaks Inline Grammar
     */

    r.breaks = merge({}, r.gfm, {
        br: replace(r.br)('{2,}', '*')(),
        text: replace(r.gfm.text)('{2,}', '*')()
    });

    return r;
})();

class InlineLexer {

    options: LexerOptions;
    renderer: Renderer;
    private inLink: boolean;
    get rules(): IInlineRules {
        return defaultInlineRules;
    }
    links: any;

    constructor(links, options) {
        this.options = options || Lexer.defaultOptions;
        this.links = links;
        // this.rules = inline.normal;
        this.renderer = this.options.renderer || new Renderer;
        this.renderer.options = this.options;

        if (!this.links) {
            throw new
                Error('Tokens array requires a `links` property.');
        }

        if (this.options.gfm) {
            if (this.options.breaks) {
                // this.rules = inline.breaks;
            } else {
                // this.rules = inline.gfm;
            }
        } else if (this.options.pedantic) {
            //   this.rules = inline.pedantic;
        }
    }

    output(src) {
        var out = ''
            , link
            , text
            , href
            , cap;

        while (src) {
            // escape
            if (cap = this.rules.escape.exec(src)) {
                src = src.substring(cap[0].length);
                out += cap[1];
                continue;
            }

            // autolink
            if (cap = this.rules.autolink.exec(src)) {
                src = src.substring(cap[0].length);
                if (cap[2] === '@') {
                    text = cap[1].charAt(6) === ':'
                        ? this.mangle(cap[1].substring(7))
                        : this.mangle(cap[1]);
                    href = this.mangle('mailto:') + text;
                } else {
                    text = escape(cap[1]);
                    href = text;
                }
                out += this.renderer.link(href, null, text);
                continue;
            }

            // url (gfm)
            if (!this.inLink && (cap = this.rules.url.exec(src))) {
                src = src.substring(cap[0].length);
                text = escape(cap[1]);
                href = text;
                out += this.renderer.link(href, null, text);
                continue;
            }

            // tag
            if (cap = this.rules.tag.exec(src)) {
                if (!this.inLink && /^<a /i.test(cap[0])) {
                    this.inLink = true;
                } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
                    this.inLink = false;
                }
                src = src.substring(cap[0].length);
                out += this.options.sanitize
                    ? this.options.sanitizer
                        ? this.options.sanitizer(cap[0])
                        : escape(cap[0])
                    : cap[0]
                continue;
            }

            // link
            if (cap = this.rules.link.exec(src)) {
                src = src.substring(cap[0].length);
                this.inLink = true;
                out += this.outputLink(cap, {
                    href: cap[2],
                    title: cap[3]
                });
                this.inLink = false;
                continue;
            }

            // reflink, nolink
            if ((cap = this.rules.reflink.exec(src))
                || (cap = this.rules.nolink.exec(src))) {
                src = src.substring(cap[0].length);
                link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
                link = this.links[link.toLowerCase()];
                if (!link || !link.href) {
                    out += cap[0].charAt(0);
                    src = cap[0].substring(1) + src;
                    continue;
                }
                this.inLink = true;
                out += this.outputLink(cap, link);
                this.inLink = false;
                continue;
            }

            // strong
            if (cap = this.rules.strong.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.strong(this.output(cap[2] || cap[1]));
                continue;
            }

            // em
            if (cap = this.rules.em.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.em(this.output(cap[2] || cap[1]));
                continue;
            }

            // code
            if (cap = this.rules.code.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.codespan(escape(cap[2], true));
                continue;
            }

            // br
            if (cap = this.rules.br.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.br();
                continue;
            }

            // del (gfm)
            if (cap = this.rules.del.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.del(this.output(cap[1]));
                continue;
            }

            // text
            if (cap = this.rules.text.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.text(escape(this.smartypants(cap[0])));
                continue;
            }

            if (src) {
                throw new
                    Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }
        }

        return out;
    }


    mangle(text) {
        if (!this.options.mangle) return text;
        var out = ''
            , l = text.length
            , i = 0
            , ch;

        for (; i < l; i++) {
            ch = text.charCodeAt(i);
            if (Math.random() > 0.5) {
                ch = 'x' + ch.toString(16);
            }
            out += '&#' + ch + ';';
        }

        return out;
    }

    outputLink(cap, link) {
        var href = escape(link.href)
            , title = link.title ? escape(link.title) : null;

        return cap[0].charAt(0) !== '!'
            ? this.renderer.link(href, title, this.output(cap[1]))
            : this.renderer.image(href, title, escape(cap[1]));
    }

    smartypants(text) {
        if (!this.options.smartypants) return text;
        return text
        // em-dashes
            .replace(/---/g, '\u2014')
        // en-dashes
            .replace(/--/g, '\u2013')
        // opening singles
            .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
        // closing singles & apostrophes
            .replace(/'/g, '\u2019')
        // opening doubles
            .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
        // closing doubles
            .replace(/"/g, '\u201d')
        // ellipses
            .replace(/\.{3}/g, '\u2026');
    }
}

class Parser {
    options: LexerOptions;
    tokens: any[] = null;
    renderer: Renderer;
    inline: InlineLexer;
    token: any;

    constructor(options?: LexerOptions) {
        this.options = options || Lexer.defaultOptions;
        this.options.renderer = this.options.renderer || new Renderer();
        this.renderer = this.options.renderer;
        this.renderer.options = this.options;
    }

    parse(src: ILexResult) {
        this.inline = new InlineLexer(src.tokenLinks, this.options);
        this.tokens = src.tokens.reverse();

        var out = '';
        while (this.next()) {
            out += this.tok();
        }

        return out;
    }

    /**
    * Next Token
    */

    next() {
        return this.token = this.tokens.pop();
    }

    /**
    * Preview Next Token
    */
    peek() {
        return this.tokens[this.tokens.length - 1] || 0;
    }

    /**
    * Parse Text Tokens
    */
    parseText() {
        var body = this.token.text;

        while (this.peek().type === 'text') {
            body += '\n' + this.next().text;
        }

        return this.inline.output(body);
    }

    /**
    * Parse Current Token
    */
    tok() {
        switch (this.token.type) {
            case 'space': {
                return '';
            }
            case 'hr': {
                return this.renderer.hr();
            }
            case 'heading': {
                return this.renderer.heading(
                    this.inline.output(this.token.text),
                    this.token.depth,
                    this.token.text);
            }
            case 'code': {
                return this.renderer.code(this.token.text,
                    this.token.lang,
                    this.token.escaped);
            }
            case 'table': {
                var header = ''
                    , body = ''
                    , i
                    , row
                    , cell
                    , flags
                    , j;

                // header
                cell = '';
                for (i = 0; i < this.token.header.length; i++) {
                    flags = { header: true, align: this.token.align[i] };
                    cell += this.renderer.tablecell(
                        this.inline.output(this.token.header[i]),
                        { header: true, align: this.token.align[i] }
                        );
                }
                header += this.renderer.tablerow(cell);

                for (i = 0; i < this.token.cells.length; i++) {
                    row = this.token.cells[i];

                    cell = '';
                    for (j = 0; j < row.length; j++) {
                        cell += this.renderer.tablecell(
                            this.inline.output(row[j]),
                            { header: false, align: this.token.align[j] }
                            );
                    }

                    body += this.renderer.tablerow(cell);
                }
                return this.renderer.table(header, body);
            }
            case 'blockquote_start': {
                var body = '';

                while (this.next().type !== 'blockquote_end') {
                    body += this.tok();
                }

                return this.renderer.blockquote(body);
            }
            case 'list_start': {
                var body = ''
                    , ordered = this.token.ordered;

                while (this.next().type !== 'list_end') {
                    body += this.tok();
                }

                return this.renderer.list(body, ordered);
            }
            case 'list_item_start': {
                var body = '';

                while (this.next().type !== 'list_item_end') {
                    body += this.token.type === 'text'
                        ? this.parseText()
                        : this.tok();
                }

                return this.renderer.listitem(body);
            }
            case 'loose_item_start': {
                var body = '';

                while (this.next().type !== 'list_item_end') {
                    body += this.tok();
                }

                return this.renderer.listitem(body);
            }
            case 'html': {
                var html = !this.token.pre && !this.options.pedantic
                    ? this.inline.output(this.token.text)
                    : this.token.text;
                return this.renderer.html(html);
            }
            case 'paragraph': {
                return this.renderer.paragraph(this.inline.output(this.token.text));
            }
            case 'text': {
                return this.renderer.paragraph(this.parseText());
            }
        }
    }

    static parse(src, options?) {
        var parser = new Parser(options);
        return parser.parse(src);
    }
}

export function marked(src, opt, callback) {
    if (callback || typeof opt === 'function') {
        if (!callback) {
            callback = opt;
            opt = null;
        }

        opt = merge({}, Lexer.defaultOptions, opt || {});

        var highlight = opt.highlight;
        var tokens: ILexResult;
        var pending;
        var i = 0;

        try {
            tokens = Lexer.lex(src, opt)
        } catch (e) {
            return callback(e);
        }

        pending = tokens.tokens.length;

        var done = function(err?) {
            if (err) {
                opt.highlight = highlight;
                return callback(err);
            }

            var out;

            try {
                out = Parser.parse(tokens, opt);
            } catch (e) {
                err = e;
            }

            opt.highlight = highlight;

            return err
                ? callback(err)
                : callback(null, out);
        };

        if (!highlight || highlight.length < 3) {
            return done();
        }

        delete opt.highlight;

        if (!pending) return done();

        for (; i < tokens.tokens.length; i++) {
            (function(token) {
                if (token.type !== 'code') {
                    return --pending || done();
                }
                return highlight(token.text, token.lang, function(err, code) {
                    if (err) return done(err);
                    if (code == null || code === token.text) {
                        return --pending || done();
                    }
                    token.text = code;
                    token.escaped = true;
                    --pending || done();
                });
            })(tokens[i]);
        }

        return;
    }
    try {
        if (opt) opt = merge({}, Lexer.defaultOptions, opt);
        return Parser.parse(Lexer.lex(src, opt), opt);
    } catch (e) {
        e.message += '\nPlease report this to https://github.com/chjj/marked.';
        if ((opt || Lexer.defaultOptions).silent) {
            return '<p>An error occured:</p><pre>'
                + escape(e.message + '', true)
                + '</pre>';
        }
        throw e;
    }
}


//test code
//
marked('*Test*', undefined, function(x,y) { console.log(x,y); });

let target = document.getElementsByTagName('div')[0]
let textBox = document.getElementsByTagName('textarea')[0];

textBox.addEventListener('keyup',()=>{
    marked(textBox.value,undefined,(e,html)=>{
        if(e!== null){

        }else{
            target.innerHTML = html;
        }
    });
});
