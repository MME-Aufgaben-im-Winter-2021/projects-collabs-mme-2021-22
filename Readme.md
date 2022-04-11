
# Collabs
Die aktuelle _Release_-Version dieses Projekts kann unter https://collabs.software-engineering.education aufgerufen werden.
```
Unsere Webapp bietet die Möglichkeit, einen Screenshot einer Webseite über Eingabe der URL hochzuladen und zum Diskurs zu stellen. Benutzer können der Projektbesprechung per Key beitreten und mit Kommentar und Markierung auf Details aufmerksam machen. Die besten/wichtigsten Hinweise können up- und downvoted werden, um dem Creator Relevanz jener zu vermitteln.
```
## Screenshots
### Startseite
Hier kann sich der Benutzer entweder einloggen oder einen zuvor erhaltenen Projekt Schlüssel eingeben und Anonym bleiben.
![Startseite](https://github.com/MME-Aufgaben-im-Winter-2021/projects-collabs-mme-2021-22/blob/main/screenshots/1.png)

### Ansicht nach Login
Hier kann der eingeloggte Benutzer auf seine Projekte zugreifen oder einen Projekt Key eingeben, um ein Projekt mit seinem Account zu verknüpfen.
![Post Login](https://github.com/MME-Aufgaben-im-Winter-2021/projects-collabs-mme-2021-22/blob/main/screenshots/2.png)

### Projektansicht
Hier auf die Inhalte eines Projekts zugegriffen werden. Kommentare erscheinen in der Farbe der verknüpften Markierung auf dem Screenshot oder sind schwarz, wenn sie den Screenshot im allgemeinen kommentieren. Oben links können neue Screenshots erstellt werden. Oben links sind von links nach rechts die Buttons zum Upload, Löschen des Projekts (kann nur der Ersteller des Projekts) und teilen des Projekt Keys.
![Projekt](https://github.com/MME-Aufgaben-im-Winter-2021/projects-collabs-mme-2021-22/blob/main/screenshots/3.png)

### Neues Projekt
Eingeloggte Benutzer können neue Projekte anlegen.
![Neues Projekt](https://github.com/MME-Aufgaben-im-Winter-2021/projects-collabs-mme-2021-22/blob/main/screenshots/4.png)


# Template für die MME-Projekte
Die aktuelle _Release_-Version dieses Projekts kann unter: https://collabs.software-engineering.education aufgerufen werden.
```
Beschreiben Sie hier in einem kurzen Absatz Ihrer Anwendung bzw. die Ziele Ihres Projekts
```

In diesem Repository finden Sie eine Vorlage für die Entwicklung Ihrer Anwendung im MME-Kurs. Das Repository gibt eine grobe Struktur für Ihre Arbeit vor. Dort wo nötig, können Sie von diesen Vorgaben abweichen. Besprechen Sie Änderungen, insbesondere solche am _Deployment-Workflow_ aber im Vorfeld mit uns. 

## Übersicht über das Repository

Im Repository befinden sich zu Beginn die folgenden Ordner und Dateien:

- `/.github` In diesem Ordner ist der [Workflow](https://github.com/features/actions) zum automatischen Bauen und Veröffentlichen Ihrer Anwendung formuliert. Idealerweise sprechen Sie Änderungen an der Konfiguration mit uns ab.
- `/app` In diesem Ordner liegen Quellcode und weitere Inhalte Ihrer Anwendung. Hier befinden sich alle Ressourcen, **die Sie selber für das Projekt angefertigt haben**. Externe Bibliotheken werden nicht in diesem Ordner abgelegt.
- `.env` In dieser Datei werden [Umgebungsvariablen](https://en.wikipedia.org/wiki/Environment_variable) festgehalten, die während des Bauvorgangs der Software benötigt werden.
- `.eslintrc`, `.jsbeautifyrc` Diese Dateien unterstützen Sie bei der [sauberen Formatierung](https://www.npmjs.com/package/js-beautify) und [Formulierung des Quellcodes](https://eslint.org/).
- `.gitignore` Die [gitignore-Datei](https://git-scm.com/docs/gitignore) ist für den hier beschriebenen Aufbau und Build-Workflow vorkonfiguriert. Denken Sie daran, dass Änderungen am Aufbau des Repositories ggf. auch dazu führen, dass Sie weitere Dateien aus der Versionskontrolle ausschließen müssen.
- `Readme.md` Diese Datei: Hier finden Sie Informationen zum Repository. Ergänzen Sie diese Datei laufend mit Informationen zu Ihrer Anwendung.
- `LICENSE` Eine Lizenzdatei mit der [MIT-Lizenz](https://opensource.org/licenses/MIT). Ersetzen Sie die Datei, falls Sie Ihr Repository unter einer anderen Lizenz veröffentlichen möchten oder müssen.

### Weitere Werkzeuge 

- `npm run dev`: Startet einen lokalen Webserver, der den Inhalt des `app`-Verzeichnis bereitstellt. Die `index.html`-Datei wird automatisch im Browser geöffnet. Während der Server läuft, wird der `app`-Ordner auf Änderungen an den beinhalteten Dateien überwacht. Ändern sich die Inhalte, wird der Webserver automatisch neu gestartet. Der Vorgang ist in der Datei `start_dev_server.js` festgehalten.
- `npm run build`: Erstellt eine _Release_-Version der Anwendung. Dabei werden etwaige Abhängigkeiten\* über `npm install` installiert, die JavaScript-Dateien in `app/src` mittels _ESLint_ geprüft und der gesamte Inhalt des `app`-Ordners in einen neuen Ordner `deploy` kopiert. Der Bauvorgang ist im wesentlich in der Datei `build_for_deployment.js` festgehalten, der bei Bedarf angepasst werden kann. 

\*: **Achtung**: Externe Bibliotheken werden dadurch wahrscheinlich nicht an die Stellen kopiert, an denen sie im _Client_ benötigt werden. Falls Sie auf externe Inhalte angewiesen sind, die Sie nicht durch direkte Links in der HTML-Datei (Stichwort [Content delivery network](https://en.wikipedia.org/wiki/Content_delivery_network)) einbinden können, sprechen Sie das weitere Vorgehen bitte mit uns ab.


### Bau und Veröffentlichung

Über den im Repository vorhandenen _Workflow_ wird Ihre Anwendung bei jedem _Push_ in die `main`-Branch neu erstellt und veröffentlicht. Dabei passieren folgenden Dinge:

- Die Anwendung wird über den Befehl `npm run build` (siehe oben) auf den GitHub-Servern gebaut.
- Der Inhalt des so erstellten `deploy`-Ordners wird in die Branch `gh-pages` kopiert.
- Die neue Webseite steht dann direkt unter der URL Ihres Projektes zur Verfügung.