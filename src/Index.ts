export * from './Guitar';
export * from './GuitarString'
export * from './MusicNote';
export * from './TabDocument';
export * from './Strum';
export * from './Scale';
export * from './GuitarStrum';
export * from './WellKnownChords';
// export * from './UI/GuitarNeck';
// export * from './UI/ChordView';
// export * from './UI/TabEditor';
// export * from './UI/TabView';
export * from './UI/UI';


import * as u from './Util/Array';

export module util {
    export var orderBy = u.orderBy;
}
