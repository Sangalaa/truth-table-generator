import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Box, Center, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Stack, Table, TableCaption, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useState } from 'react';
import interpret from '../parser/parser';

const Index = () => {
    const [result, setResult] = useState<Object>(null);

    const [error, setError] = useState(null);

    return (
        <Flex alignItems="center" justifyContent="center">
            <Stack spacing={8} mt={4}>
            <Center><Heading as="h1">Truth table generator</Heading></Center>
            
            <FormControl isInvalid={!!error}>
                <FormLabel htmlFor="expression">Expression</FormLabel>
                <InputGroup>
                    <Input name="expression" id="expression" type="text" label="Expression" placeholder="A => (B => A)" onChange={(e) => {
                        try {
                            if(e.target.value === '') setResult(null);
                            else setResult(interpret('(' + e.target.value + ')'));

                            setError(null);
                        }
                        catch(err) {
                            setError({expression: "Invalid expression"});
                        }
                    }}>

                    </Input>
                    <InputRightElement children={!error ? <CheckIcon color="green.500"></CheckIcon> : <CloseIcon color="red.500" />} />
                </InputGroup>
                
            </FormControl>

            <Table variant="simple" size="sm">
                <TableCaption>Truth table</TableCaption>
                <Thead>
                    <Tr>
                        <>
                            {
                                result && 
                                Object.keys(result).map((key) => {
                                    return <Th textAlign="center" verticalAlign="middle">{key}</Th>
                                })
                            }
                        </>
                    </Tr>
                </Thead>
                <Tbody>
                <>
                    {
                        result && 
                        Object.values(result)[0].map((_, index) => {
                            return <Tr>
                                    {
                                        Object.values(result).map((value) => (<Td textAlign="center" verticalAlign="middle">{value[index]}</Td>))
                                    }
                                    </Tr>
                        })
                    }
                </>
                </Tbody>
            </Table>
            </Stack>
        </Flex>
    );
}

export default Index;