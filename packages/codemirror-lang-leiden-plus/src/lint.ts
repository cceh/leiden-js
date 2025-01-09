import {leidenBaseLinter} from "@leiden-plus/lib/linter";

export const leidenPlusLinter = leidenBaseLinter(node => {
    if (node.type.isError) {
        console.log(node.node)
        if (node.matchContext(["Abbrev"])) {
            return [{
                from: node.node.parent!.from,
                to: node.to,
                severity: "error", message: "Error abbrev1!"
            }]
        }
    }

    // if (node.name === "NumberSpecial") {
    //     const { from, to } = node
    //     return [{
    //         from, to, severity: "error", message: "Oh Gott! EIN NUMBER SPECIAL!"
    //     }]
    // }
})