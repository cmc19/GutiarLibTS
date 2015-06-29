import {Guitar, IGuitar} from './Guitar';
import {Strum} from './Strum';
import {GuitarString} from './GuitarString';
import {IMusicNote, IMusicNoteAdvanced, MusicNoteName, MusicNotes} from './MusicNote';
import {LinkedList} from './Util/Collections';
import {SimpleEvent} from './Util/SimpleEvent';

export enum TabPartType {
    Strum,
    Line
}


export class TabDocument {

    private _partAddedEvent = SimpleEvent.New();

    parts: LinkedList<TabPart> = new LinkedList<TabPart>();
    guitar: Guitar;

    get partCount() {
        return this.parts.count;
    }

    constructor(g: Guitar) {
        this.guitar = g;
    }

    addStrum(s: Strum, index?: number) {
        if (s.stringCount != this.guitar.strings.length) {
            console.error('strum not added');
            return;

        }
        var ts = new TabStrum(s.positions);
        this.addPart(ts);
    }

    addPart(part: TabPart) {
        this.parts.add(part);
        this._partAddedEvent.trigger();
    }

    addLine(){
        this.addPart(new TabLine());
    }

    toObject(): ITabDocument {
        return {
            gutar: this.guitar.toObject(),
            parts: this.parts.toArray().map(x=> x.toObject())
        }
    }

    static fromObject(obj: ITabDocument) {
        let td = new TabDocument(Guitar.fromObject(obj.gutar));
        obj.parts.forEach(x=> {
            switch (x.type) {
                case TabPartType.Strum:
                    let strum = <ITabStrum> x;
                    td.addPart(TabStrum.fromObject(strum));
            }
        });

        return td;
    }

    onPartAdded(fn: Function) {
        this._partAddedEvent.on(fn);
    }
}

export class TabStrum extends Strum implements TabPart {

    get type() {
        return TabPartType.Strum;
    }

    toObject(): ITabStrum {
        return {
            type: TabPartType.Strum,
            positions: this.positions
        }
    }

    static fromObject(obj: ITabStrum): TabStrum {
        var ts = new TabStrum(obj.positions);
        return ts;
    }
}

export class TabLine implements TabPart {
    get type() {
        return TabPartType.Line;
    }

    toObject() {
        return {
            type: this.type
        };
    }
}

export interface TabPart {
    type: TabPartType;
    toObject(): ITabPart;
}

export interface ITabPart {
    type: TabPartType;
}

export interface ITabStrum extends ITabPart {
    positions: number[];
}

export interface ITabDocument {
    gutar: IGuitar;
    parts: ITabPart[];
}
