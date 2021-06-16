import fs from 'fs'
import path from 'path'
const photoDir = process.cwd() + '/images'

const download = async (req, res) => {
    try {
        const subFolder = req.params.subfol
        const filename = `${photoDir}/${req.params.folder}/${subFolder}/${req.params.filename}`
        if (!fs.existsSync(path.join(filename))) return res.status(400).send({ message: 'File not found.' })
        res.download(filename)
    } catch (error) {
        return res.status(500).send({ message: `Download ${error}.` })
    }
}

export default { download }