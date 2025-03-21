import {Snippets} from "@leiden-plus/lib/language";

export const snippets = {
    translation: {
        template: "<T=\n    ${}\n=T>",
        completion: {
            label: "<T=${translation}=T>",
            displayLabel: "Translation",
            detail: "no language specified",
            info: "<T= ... =T>"
        }
    },
    translationWithLanguage: {
        template: "<T=.${language id}\n    ${}\n=T>",
        completion: {
            label: "<T=.${langId} ${translation}=T>",
            displayLabel: "Translation",
            detail: "other language",
            info: "<T=.lang ... =T>"
        }
    },
    translationEnglish: {
        template: "<T=.en\n    ${}\n=T>",
        completion: {
            label: "<T=.en ${translation}=T>",
            displayLabel: "Translation",
            detail: "English",
            info: "<T=.en ... =T>"
        }
    },
    translationGerman: {
        template: "<T=.de\n    ${}\n=T>",
        completion: {
            label: "<T=.de ${translation}=T>",
            displayLabel: "Translation",
            detail: "German",
            info: "<T=.de ... =T>"
        }
    },

    division: {
        template: "<D=.${n} \n    <=\n        ${division text}\n    =>\n=D>",
        completion: {
            label: "<D=.${n} <= ${division text} =>=D>",
            displayLabel: "Division",
            detail: "other",
            info: "<D=.n <= ... => =D>"
        }
    },
    divisionRecto: {
        template: "<D=.r \n    <=\n        ${division text}\n    =>\n=D>",
        completion: {
            label: "<D=.r <= ${division text} =>=D>",
            displayLabel: "Division",
            detail: "Recto",
            info: "<D=.r <= ... => =D>"
        }
    },
    divisionVerso: {
        template: "<D=.v \n    <=\n        ${division text}\n    =>\n=D>",
        completion: {
            label: "<D=.v <= ${division text} =>=D>",
            displayLabel: "Division",
            detail: "Verso",
            info: "<D=.v <= ... => =D>"
        }
    },
    divisionFragment: {
        template: "<D=.${a}.fragment \n    <=\n        ${division text}\n    =>\n=D>",
        completion: {
            label: "<D=.${a}.fragment <= ${division text} =>=D>",
            displayLabel: "Division",
            detail: "Fragment",
            info: "<D=.a.fragment <= ... => =D>"
        }
    },
    divisionColumn: {
        template: "<D=.${i}.column \n    <=\n        ${division text}\n    =>\n=D>",
        completion: {
            label: "<D=.${i}.column <= ${division text} =>=D>",
            displayLabel: "Division",
            detail: "Column",
            info: "<D=.i.column <= ... => =D>"
        }
    },
    divisionOtherType: {
        template: "<D=.${n}.${type} \n    <=\n        ${division text}\n    =>\n=D>",
        completion: {
            label: "<D=.${n}.${type} <= ${division text} =>=D>",
            displayLabel: "Division",
            detail: "other type",
            info: "<D=.n.type <= ... => =D>"
        }
    },

    block: {
        template: "<=\n    ${}\n=>",
        completion: {
            label: "<=\n    ${text}\n=>",
            displayLabel: "Block",
            info: "<= text =>"
        }
    },

    milestoneLineNumber: {
        template: "((${num}))",
        completion: {
            label: "((${num}))",
            displayLabel: "Milestone line number",
            info: "((1))"
        }
    },
    milestoneLineNumberBreak: {
        template: "(((${num})))",
        completion: {
            label: "(((${num})))",
            displayLabel: "Milestone line number",
            detail: "with break",
            info: "(((1)))"
        }
    },

    lacuna: {
        template: "[...]",
        completion: {
            label: "[...]",
            displayLabel: "Lacuna",
            info: "[...]"
        }
    },
    illegible: {
        template: "...",
        completion: {
            label: "...",
            displayLabel: "Illegible",
            info: "..."
        }
    },
    deletion: {
        template: "〚${deleted text}〛",
        completion: {
            label: "〚${deleted text}〛",
            displayLabel: "Deleted text",
            info: "⟦abc⟧"
        }
    },
    term: {
        template: "<${translation}=${term}>",
        completion: {
            label: "<${translation}=${term}>",
            displayLabel: "Term",
            detail: "without language",
            info: "<definition=term>"
        }
    },
    termWithLanguage: {
        template: "<${translation}~{language id}=${term}>",
        completion: {
            label: "<${translation}~{language id}=${term}>",
            displayLabel: "Term",
            detail: "other language",
            info: "<definition~lang=translation>"
        }
    },

    termLatin: {
        template: "<${translation}~la=${term}>",
        completion: {
            label: "<${translation}~la=${term}>",
            displayLabel: "Term",
            detail: "Latin",
            info: "<definition~la=translation>"
        }
    },

    termGreek: {
        template: "<${translation}~grc=${term}>",
        completion: {
            label: "<${translation}~grc=${term}>",
            displayLabel: "Term",
            detail: "Greek",
            info: "<definition~grc=translation>"
        }
    },

    termGreekLatin: {
        template: "<${translation}~grc-Latn=${term}>",
        completion: {
            label: "<${translation}~grc-Latn=${term}>",
            displayLabel: "Term",
            detail: "Greek Latin",
            info: "<definition~grc-Latn=translation>"
        }
    },


    foreign: {
        template: "~|${foreign text}|~${lang} ",
        completion: {
            label: "~|${foreign text}|~${lang} ",
            displayLabel: "Foreign text",
            detail: "other language",
            info: "~|ϣ|~cop"
        }
    },
    foreignLatin: {
        template: "~|${latin text}|~la ",
        completion: {
            label: "~|${latin text}|~la ",
            displayLabel: "Foreign text",
            detail: "Latin",
            info: "~|abc|~la"
        }
    },
    foreignGreek: {
        template: "~|${greek text}|~grc ",
        completion: {
            label: "~|${greek text}|~grc ",
            displayLabel: "Foreign text",
            detail: "Greek",
            info: "~|αβγ|~grc"
        }
    },


    note: {
        template: "/*${note text}*/",
        completion: {
            label: "/*${note text}*/",
            displayLabel: "Note",
            info: "/*abc*/"
        }
    },

    apparatusEntry: {
        template: "<:${lemma}|${reference}:${note}|:>",
        completion: {
            label: "<:${lemma}|${reference}:${note}|:>",
            displayLabel: "Apparatus entry",
            detail: "other reference",
            info: "<:lemma|BGU:note|:>"
        }
    },

    apparatusEntryBGU: {
        template: "<:${lemma}|BGU:${note}|:>",
        completion: {
            label: "<:${lemma}|BGU:${note}|:>",
            displayLabel: "Apparatus entry",
            detail: "BGU",
            info: "<:lemma|BGU:note|:>"
        }
    },

    apparatusEntryBGUDDbDP: {
        template: "<:${lemma}|BGU_DDbDP:${note}|:>",
        completion: {
            label: "<:${lemma}|BGU_DDbDP:${note}|:>",
            displayLabel: "Apparatus entry",
            detail: "BGU-DDbDP",
            info: "<:lemma|BGU_DDbDP:note|:>"
        }
    },

    apparatusEntryNoRef: {
        template: "<:${lemma}|:${note}|:>",
        completion: {
            label: "<:${lemma}|:${note}|:>",
            displayLabel: "Apparatus entry",
            detail: "no reference",
            info: "<:lemma|:note|:>"
        }
    },

} satisfies Snippets
