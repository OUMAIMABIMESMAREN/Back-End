import React, { useEffect } from 'react';
import { participantService } from '../services/participantService'; // Adjusted path

const TestAuthComponent = () => {
    useEffect(() => {
        participantService.getTestAuth();
    }, []);

    return <div>Check console for /test-auth result</div>;
};

export default TestAuthComponent; 