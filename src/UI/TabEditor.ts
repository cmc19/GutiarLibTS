
import {repeat} from './BaseUI';
import {KeyManager} from '../Util/KeyManager';
import {SimpleEvent} from '../Util/SimpleEvent';
import { TabView } from './TabView';
import { Guitar } from "../Guitar";
import {TabCell} from './Tab/TabCell';
import {TabColumn} from './Tab/TabColumn';
import {TabDocument} from '../TabDocument';

export class TabEditor extends TabView {
    keys: KeyManager;
    private _onChange = SimpleEvent.New();

    public get allowSelect() {
        return true;
    }

    constructor(ele: HTMLElement, td: TabDocument) {
        super(ele, td);

        this.initTabDocEvents();

        if (td.partCount == 0) {
            td.addStrum(td.guitar.getBlankStrum())
        }
        this.keys = new KeyManager(this.element);
        this.bindKeys();
    }

    private initTabDocEvents() {
        this.document.onPartAdded(() => { this.partAddedToDocument(); });
    }

    private partAddedToDocument() {
        console.log('partAddedToDocument');
        this._buildTabColumns();
    }

    private bindKeys() {
        let k = this.keys;

        k.bind('up', (e) => {
            e.preventDefault();
            this.selectUp();
        });

        k.bind('down', (e) => {
            e.preventDefault();
            this.selectDown();
        });

        k.bind('left', e=> {
            e.preventDefault();
            this.selectedCell.left().select();
        });

        k.bind('right', e=> {
            e.preventDefault();
            this.selectedCell.right().select();
        });

        k.bind('del', e=> {
            e.preventDefault();
            this.selectedCell.setText('');
        });

        k.bind('/', e=> {
            e.preventDefault();
            this.selectedCell.appendText('/');
        });

        repeat(10, idx=> {
            //ABCZ
            k.bind(idx.toString(), (e) => {
                e.preventDefault();
                console.log(idx.toString() + ' key pressed', this)
                this.selectedCell.appendText(idx.toString());
            });
        });


    }

    private selectUp() {
        this.selectedCell.up().select();
    }

    private selectDown() {
        this.selectedCell.down().select();
    }

    private setUpEvents() {

    }

}
