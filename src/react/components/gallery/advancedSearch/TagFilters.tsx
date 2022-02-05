import React from 'react';
import TagSelector, {Tag} from "../../../image_viewer/components/TagSelector";

const AdvancedSearch = (props: PropTypes) => {

    const {
        tags,
        incTags,
        setIncTags
    } = props

    return (
        <React.Fragment>
            <TagSelector
                label={"Include Tags"}
                tags={tags}
                selectedTags={incTags}
                onChange={setIncTags}
            />
        </React.Fragment>
    )
}

interface PropTypes {
    tags: Tag[]
    incTags: Tag[]
    setIncTags: (value: Tag[]) => void
}

export default AdvancedSearch
