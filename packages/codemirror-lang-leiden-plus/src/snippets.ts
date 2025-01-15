import {Completion, snippet, snippetCompletion} from "@codemirror/autocomplete";

export const snippets: Record<string, {
    template: string,
    completion: Completion
}> = {
    vestigChars: {
        template: "vestig.${num}char",
        completion: {
            label: "Vestiges",
            detail: "no. of chars",
            type: "keyword"
        }
    },
    vestigCharsRange: {
        template: "vestig.${from}-${to}char",
        completion: {
            label: "Vestiges",
            detail: "range of chars",
            type: "keyword"
        }
    },
    vestigCharsCa: {
        template: "vestig.ca.${num}char",
        completion: {
            label: "Vestiges",
            detail: "approx. no. of chars",
            type: "keyword"}
    },
    vestigLines: {
        template: "vestig.${num}lin",
        completion: {
            label: "Vestiges",
            detail: "no. of lines",
            type: "keyword"
        }
    },
    vestigLinesRange: {
        template: "vestig.${from}-${to}lin",
        completion: {
            label: "Vestiges",
            detail: "range of lines",
            type: "keyword"
        }
    },
    vestigLinesCa: {
        template: "vestig.ca.${num}lin",
        completion: {
            label: "Vestiges",
            detail: "approx. no. of lines",
            type: "keyword"
        }
    },
    vestigLinesUnknown: {
        template: "vestig.?lin",
        completion: {
            label: "Vestiges",
            detail: "unknown no. of lines",
            type: "keyword"
        }
    },

    abbreviation: {
        template: "((${expansion}))",
        completion: {
            label: "Abbreviation",
            detail: "with expansion",
            type: "keyword"
        }
    },

    abbreviationUnresolved: {
        template: "(|${abbreviation}|)",
        completion: {
            label: "Abbreviation",
            detail: "not resolved",
            type: "keyword"
        }
    },

    suppliedLost: {
        template: "[${supplied lost text}]",
        completion: {
            label: "Supplied lost text",
            detail: "supplied lost text",
            type: "keyword"
        }
    },

    gapLostChars: {
        template: "[.${num}]",
        completion: {
            label: "Lacuna",
            detail: "no. of lost chars",
            type: "keyword"
        }
    },
    gapLostCharsRange: {
        template: "[.${from}-${to}]",
        completion: {
            label: "Lacuna",
            detail: "range of lost chars",
            type: "keyword"
        }
    },
    gapLostCharsCa: {
        template: "[ca.${num}]",
        completion: {
            label: "Lacuna",
            detail: "approx. no. of lost chars",
            type: "keyword"
        }
    },
    gapLostCharsUnknown: {
        template: "[.?]",
        completion: {
            label: "Lacuna",
            detail: "unknown no. of lost chars",
            type: "keyword"
        }
    },

    number: {
        template: "<#${symbol/text on papyrus}=${numeric value}#>",
        completion: {
            label: "Number",
            detail: "number"
        }
    },
    numberFraction: {
        template: "<#${symbol/text on papyrus}=${numerator}/${denominator}#>",
        completion: {
            label: "Number",
            detail: "fraction"
        }
    },
    numberFractionUnknown: {
        template: "<#${symbol/text on papyrus}=frac#>",
        completion: {
            label: "Number",
            detail: "fraction, unknown"
        }
    },
    numberRange: {
        template: "<#${symbol/text on papyrus}=${from}-${to}#>",
        completion: {
            label: "Number",
            detail: "range"
        }
    },
    numberRangeUnknownEnd: {
        template: "<#${symbol/text on papyrus}=${from}-?#>",
        completion: {
            label: "Number",
            detail: "range, open end"
        }
    },

    numberTick: {
        template: "<#${symbol/text on papyrus} '=${numeric value}#>",
        completion: {
            label: "Number",
            detail: "with tick"
        }
    },
    numberTickFraction: {
        template: "<#${symbol/text on papyrus} '=${numerator}/${denominator}#>",
        completion: {
            label: "Number",
            detail: "with tick, fraction"
        }
    },
    numberTickFractionUnknown: {
        template: "<#${symbol/text on papyrus} '=frac#>",
        completion: {
            label: "Number",
            detail: "with tick, fraction, unknown"
        }
    },

   deletion: {
        template: "〚${deleted text}〛",
        completion: {
            label: "Deletion",
            detail: ""
        }
    },
    deletionSlashes: {
        template: "〚/ ${deleted text}〛",
        completion: {
            label: "Deletion",
            detail: "by slashes"
        }
    },
    deletionCrossStrokes: {
        template: "〚X ${deleted text}〛",
        completion: {
            label: "Deletion",
            detail: "by cross strokes"
        }
    },



    //
    // vestigLines: {
    //     template: "vestig.${num}lin",
    //     completion: {
    //         label: "Vestiges",
    //         detail: "no. of lines",
    //         type: "keyword"
    //     }
    // },
    // vestigLinesRange: {
    //     template: "vestig.${from}-${to}lin",
    //     completion: {
    //         label: "Vestiges",
    //         detail: "range of lines",
    //         type: "keyword"
    //     }
    // },
    // vestigLinesCa: {
    //     template: "vestig.ca.${num}lin",
    //     completion: {
    //         label: "Vestiges",
    //         detail: "approx. no. of lines",
    //         type: "keyword"
    //     }
    // },
    // vestigLinesUnknown: {
    //     template: "vestig.?lin",
    //     completion: {
    //         label: "Vestiges",
    //         detail: "unknown no. of lines",
    //         type: "keyword"
    //     }
    // },
}
