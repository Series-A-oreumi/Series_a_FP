
function getStudyIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const studyId = urlParams.get('id');
    return studyId;
}


async function fetchStudyData(studyId) {
    const accessToken = localStorage.getItem('access_token');

    try {
        const response = await fetch(`http://localhost:8000/api/study/${studyId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const studyData = await response.json();
            console.log(studyData)
            // Populate the form fields with existing data
            document.querySelector('input[name="title"]').value = studyData.study.title;
            document.querySelector('textarea[name="content"]').value = studyData.study.content;
            document.querySelector('select[name="project_study"]').value = studyData.study.project_study;
            document.querySelector('select[name="online_offline"]').value = studyData.study.online_offline;
            // document.querySelector('select[name="stacks"]').value = studyData.study.stacks;
            document.querySelector('select[name="field"]').value = studyData.study.field;
            document.querySelector('select[name="participant_count"]').value = studyData.study.participant_count;
            document.querySelector('select[name="period"]').value = studyData.study.period;
            document.querySelector('select[name="public_private"]').value = studyData.study.public_private;
            document.querySelector('input[name="end_at"]').value = studyData.study.end_at.substring(0, 10); // Format date
            document.querySelector('input[name="start_at"]').value = studyData.study.start_at.substring(0, 10); // Format date

            // Handle the stacks field
            const selectedStack = studyData.study.stacks.map(stack => stack.name);
            const stackSelect = document.querySelector('select[name="stacks"]');

            for (const option of stackSelect.options) {
                if (selectedStack.includes(option.value)) {
                    option.selected = true;
                }
            }

        } else {
            alert('스터디 데이터를 불러오는데 실패했습니다.');
        }
    } catch (error) {
        console.error('오류:', error);
    }
}

const studyId = getStudyIdFromURL();

window.addEventListener('load', () => {
    fetchStudyData(studyId);
});



const studyForm = document.querySelector('.study-form');

studyForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(studyForm);
    const accessToken = localStorage.getItem('access_token');

    const selectedStack = Array.from(document.querySelectorAll('#stacks option:checked')).map(option => option.value);

    try {
        const response = await fetch(`http://localhost:8000/api/study/${studyId}/`, {
            method: 'PUT', // Use PUT for updates
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...Object.fromEntries(formData),
                stacks: selectedStack,
                // Include any other fields you want to update
            }),
        });

        if (response.ok) {
            alert('스터디 데이터를 성공적으로 업데이트했습니다.');
            window.location.href = '../html/studylist.html';
        } else {
            alert('모든 항목들을 입력해주세요.');
        }
    } catch (error) {
        console.error('오류:', error);
    }
});
